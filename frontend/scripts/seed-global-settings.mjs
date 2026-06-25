import { createSanityWriteClient } from "./lib/sanity-page-guards.mjs";
import {
  settingsData,
  navigationData,
  siteSettingsData,
  seoSettingsData,
  ogSettingsData
} from "./data/global-settings.mjs";

async function run() {
  const write = process.argv.includes("--write");
  const client = await createSanityWriteClient();

  const documentsToSeed = [
    settingsData,
    navigationData,
    siteSettingsData,
    seoSettingsData,
    ogSettingsData
  ];

  if (!write) {
    console.log("DRY RUN: The following global settings documents will be upserted:");
    documentsToSeed.forEach((doc) => {
      console.log(`- ${doc._id} (${doc._type})`);
    });
    console.log("\nRun with --write to execute.");
    return;
  }

  for (const doc of documentsToSeed) {
    try {
      await client.createOrReplace(doc);
      console.log(`✅ Upserted ${doc._id}`);
    } catch (error) {
      console.error(`❌ Failed to upsert ${doc._id}:`, error.message);
    }
  }

  console.log("\n🎉 All global settings successfully seeded!");
}

run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
