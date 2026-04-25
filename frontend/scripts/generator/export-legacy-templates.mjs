import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSanityReadClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..", "..");
const OUTPUT_PATH = path.join(FRONTEND_DIR, "tmp", "generator-legacy-template-inventory.json");

const PAGE_TEMPLATES_QUERY = `*[_type == "pageTemplate"] | order(lane asc, title asc){
  _id,
  title,
  lane,
  variant,
  "slug": slug.current,
  shellId,
  topBlockCountDefault
}`;

const PAGE_LOCATIONS_QUERY = `*[_type == "pageLocation"] | order(route asc, title asc){
  _id,
  title,
  route,
  routePattern,
  "slug": slug.current,
  topBlockCount,
  contentStatus,
  template->{
    _id,
    title,
    lane,
    variant,
    "slug": slug.current,
    shellId,
    topBlockCountDefault
  },
  location->{
    _id,
    title,
    "slug": slug.current
  }
}`;

const SERVICE_LOCATIONS_QUERY = `*[_type == "serviceLocation"] | order(route asc, title asc){
  _id,
  title,
  route,
  routePattern,
  "slug": slug.current,
  topBlockCount,
  contentStatus,
  template->{
    _id,
    title,
    lane,
    variant,
    "slug": slug.current,
    shellId,
    topBlockCountDefault
  },
  service->{
    _id,
    title,
    "slug": slug.current
  },
  serviceType->{
    _id,
    title,
    "slug": slug.current
  },
  location->{
    _id,
    title,
    "slug": slug.current
  }
}`;

function normalizeDesignFamily(lane) {
  const value = `${lane || ""}`.trim().toLowerCase();

  if (["website", "software", "printing", "generic"].includes(value)) {
    return value;
  }

  return "generic";
}

function normalizeTopBlockCount(value) {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

function mapLegacyTemplateToGeneratorSeed(legacy = {}) {
  return {
    title: legacy.title?.trim() || "Migrated Legacy Template",
    designFamily: normalizeDesignFamily(legacy.lane),
    shellId: legacy.shellId?.trim() || null,
    topBlockCount: normalizeTopBlockCount(legacy.topBlockCountDefault),
    source: {
      legacyId: legacy._id?.trim() || null,
      legacySlug: legacy.slug?.trim() || null,
      legacyVariant: legacy.variant?.trim() || null,
    },
  };
}

function summarizeLocations(docs = []) {
  const byTemplateId = new Map();
  let missingTemplate = 0;

  for (const doc of docs) {
    const templateId = doc?.template?._id;
    if (!templateId) {
      missingTemplate += 1;
      continue;
    }
    byTemplateId.set(templateId, (byTemplateId.get(templateId) || 0) + 1);
  }

  return {
    total: docs.length,
    missingTemplate,
    byTemplateId: Object.fromEntries([...byTemplateId.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  };
}

async function main() {
  const env = await loadSanityEnv();
  const client = await createSanityReadClient();

  const [pageTemplates, pageLocations, serviceLocations] = await Promise.all([
    client.fetch(PAGE_TEMPLATES_QUERY),
    client.fetch(PAGE_LOCATIONS_QUERY),
    client.fetch(SERVICE_LOCATIONS_QUERY),
  ]);

  const inventory = {
    ok: true,
    readOnly: true,
    generatedAt: new Date().toISOString(),
    dataset: `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim() || null,
    projectId: `${env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""}`.trim() || null,
    counts: {
      pageTemplates: pageTemplates.length,
      pageLocations: pageLocations.length,
      serviceLocations: serviceLocations.length,
    },
    summaries: {
      pageLocations: summarizeLocations(pageLocations),
      serviceLocations: summarizeLocations(serviceLocations),
    },
    pageTemplates: pageTemplates.map((template) => ({
      ...template,
      generatorSeed: mapLegacyTemplateToGeneratorSeed(template),
    })),
    pageLocations,
    serviceLocations,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        readOnly: true,
        outputPath: OUTPUT_PATH,
        dataset: inventory.dataset,
        counts: inventory.counts,
        missingTemplateRefs: {
          pageLocations: inventory.summaries.pageLocations.missingTemplate,
          serviceLocations: inventory.summaries.serviceLocations.missingTemplate,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
