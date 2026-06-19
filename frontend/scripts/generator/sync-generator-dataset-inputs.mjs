import {
  assertGeneratorDatasetTarget,
  createSanityReadClientWithDraftAccess,
  createSanityWriteClient,
  loadSanityEnv,
  resolveSanityDataset,
  resolveSanityTokenSource,
} from "../lib/sanity-page-guards.mjs";

const args = process.argv.slice(2);
const WRITE_MODE = args.includes("--write");
const datasetIdArg = args.find((arg) => arg.startsWith("--id="));
const targetDatasetId = datasetIdArg ? datasetIdArg.slice("--id=".length) : null;

const DATASET_QUERY = `*[_type == "generatorDataset"${targetDatasetId ? " && _id == $id" : ""}] | order(title asc){
  _id,
  title,
  importMode,
  keywordSetCsv,
  rowCsv,
  keywordSets[]{_key,key,label,primaryKeyword,secondaryKeywords,angle},
  rows[]{_key,key,label,service,city,primaryKeyword,secondaryKeywords,industry,offer,localCondition,tokens[]{_key,name,values}}
}`;

function parseCsv(text) {
  const source = `${text || ""}`.trim();
  if (!source) return [];

  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current);
      if (row.some((cell) => cell.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  if (row.some((cell) => cell.trim().length > 0)) {
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((cell) => cell.trim());

  return dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, `${cells[index] || ""}`.trim()])),
  );
}

function toSecondaryKeywords(value) {
  return `${value || ""}`
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeKeywordSets(records) {
  return records
    .filter((record) => record.key && record.primaryKeyword)
    .map((record, index) => ({
      _key: record.key || `kw-${index + 1}`,
      key: record.key || `kw-${index + 1}`,
      label: record.label || record.primaryKeyword,
      primaryKeyword: record.primaryKeyword,
      secondaryKeywords: toSecondaryKeywords(record.secondaryKeywords),
      angle: record.angle || undefined,
    }));
}

function normalizeRows(records) {
  const STANDARD_HEADERS = [
    "key", "label", "service", "city", "primaryKeyword",
    "secondaryKeywords", "industry", "offer", "localCondition"
  ];

  return records
    .filter((record) => record.key)
    .map((record, index) => {
      const tokens = [];

      // Any key not in STANDARD_HEADERS is a custom token
      for (const [key, value] of Object.entries(record)) {
        if (!STANDARD_HEADERS.includes(key) && key.trim() !== "") {
          const values = toSecondaryKeywords(value);
          if (values.length > 0) {
            tokens.push({
              _key: key,
              name: key,
              values,
            });
          }
        }
      }

      return {
        _key: record.key || `row-${index + 1}`,
        key: record.key || `row-${index + 1}`,
        label: record.label || record.city || record.service || `Row ${index + 1}`,
        service: record.service || undefined,
        city: record.city || undefined,
        primaryKeyword: record.primaryKeyword || undefined,
        secondaryKeywords: toSecondaryKeywords(record.secondaryKeywords),
        industry: record.industry || undefined,
        offer: record.offer || undefined,
        localCondition: record.localCondition || undefined,
        tokens: tokens.length > 0 ? tokens : undefined,
      };
    });
}

async function main() {
  const env = await loadSanityEnv();
  const dataset = resolveSanityDataset(env);
  const { source: tokenSource } = resolveSanityTokenSource(env);
  const allowProductionWrite = args.includes("--allow-production-write");
  assertGeneratorDatasetTarget(dataset, { writeMode: WRITE_MODE, allowProductionWrite });

  if (WRITE_MODE && !tokenSource) {
    throw new Error("Missing Sanity write token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  }

  const readClient = await createSanityReadClientWithDraftAccess({ dataset });
  const docs = await readClient.fetch(DATASET_QUERY, targetDatasetId ? { id: targetDatasetId } : {});

  const inspected = [];
  const updates = [];

  for (const doc of docs) {
    const csvMode = doc?.importMode === "csv-ready";
    const parsedKeywordSets = normalizeKeywordSets(parseCsv(doc?.keywordSetCsv));
    const parsedRows = normalizeRows(parseCsv(doc?.rowCsv));
    const shouldUpdate = csvMode && (parsedKeywordSets.length > 0 || parsedRows.length > 0);

    inspected.push({
      _id: doc._id,
      title: doc.title,
      csvMode,
      parsedKeywordSets: parsedKeywordSets.length,
      parsedRows: parsedRows.length,
      existingKeywordSets: Array.isArray(doc.keywordSets) ? doc.keywordSets.length : 0,
      existingRows: Array.isArray(doc.rows) ? doc.rows.length : 0,
      willUpdate: shouldUpdate,
    });

    if (shouldUpdate) {
      updates.push({
        _id: doc._id,
        keywordSets: parsedKeywordSets,
        rows: parsedRows,
      });
    }
  }

  if (WRITE_MODE && updates.length > 0) {
    const writeClient = await createSanityWriteClient({ dataset });
    for (const update of updates) {
      await writeClient.patch(update._id).set({
        keywordSets: update.keywordSets,
        rows: update.rows,
      }).commit();
    }
  }

  console.log(JSON.stringify({
    ok: true,
    writeMode: WRITE_MODE,
    dataset,
    tokenSource,
    targetDatasetId,
    inspected,
    updatedIds: updates.map((item) => item._id),
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
