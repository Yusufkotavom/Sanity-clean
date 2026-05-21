/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const studioHost = process.env.SANITY_STUDIO_HOSTNAME;
const appId = process.env.SANITY_STUDIO_APP_ID;

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: "../web-astro/src/lib/sanity/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../web-astro/src/lib/sanity/generated.types.ts",
    overloadClientMethods: true,
  },
  deployment: {
    studioHost,
    ...(appId ? { appId } : {}),
  },
});
