import { loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const env = await loadSanityEnv();
const token = env.SANITY_DEV || env.SANITY_AUTH_TOKEN;
const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_STUDIO_DATASET || ""}`.trim().toLowerCase();

if (!token) {
  console.error("Missing development write credential");
  process.exit(1);
}

if (dataset === "production") {
  console.error("Refusing to target production dataset");
  process.exit(1);
}

if (dataset !== "development") {
  console.error(`Generator write guard expects development dataset, received ${dataset || "<empty>"}`);
  process.exit(1);
}

console.log("Generator write guard passed");
