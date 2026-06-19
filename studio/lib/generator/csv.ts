import { GeneratorRow } from "./types";

function toSecondaryKeywords(value?: string | null): string[] {
  return `${value || ""}`
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseCsvToRows(text?: string | null): GeneratorRow[] {
  const source = `${text || ""}`.trim();
  if (!source) return [];

  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
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

  const records = dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, `${cells[index] || ""}`.trim()]))
  );

  const STANDARD_HEADERS = [
    "key", "label", "service", "city", "primaryKeyword",
    "secondaryKeywords", "industry", "offer", "localCondition"
  ];

  return records
    .filter((record) => record.key)
    .map((record, index) => {
      const tokens: { _key: string; name: string; values: string[] }[] = [];

      for (const [key, value] of Object.entries(record)) {
        if (!STANDARD_HEADERS.includes(key) && key.trim() !== "") {
          const values = toSecondaryKeywords(value as string);
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
        primaryKeyword: record.primaryKeyword || "",
        secondaryKeywords: toSecondaryKeywords(record.secondaryKeywords as string | undefined),
        industry: record.industry || undefined,
        offer: record.offer || undefined,
        localCondition: record.localCondition || undefined,
        tokens: tokens.length > 0 ? tokens : undefined,
      } as GeneratorRow;
    });
}
