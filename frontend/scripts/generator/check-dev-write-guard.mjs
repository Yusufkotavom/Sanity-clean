import {
  assertGeneratorDatasetTarget,
  loadSanityEnv,
  resolveSanityDataset,
  resolveSanityTokenSource,
} from "../lib/sanity-page-guards.mjs";

const env = await loadSanityEnv();
const { token, source: tokenSource } = resolveSanityTokenSource(env);
const dataset = resolveSanityDataset(env).toLowerCase();
const allowProductionWrite = process.argv.includes("--allow-production-write");

if (!token) {
  console.error("Missing Sanity write credential. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  process.exit(1);
}

try {
  assertGeneratorDatasetTarget(dataset, { writeMode: true, allowProductionWrite });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(`Generator write guard passed for dataset=${dataset} tokenSource=${tokenSource}`);
