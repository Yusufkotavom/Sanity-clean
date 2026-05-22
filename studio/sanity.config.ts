import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import { iconPicker } from "sanity-plugin-icon-picker-v2";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./schema-types";
import { resolve } from "./presentation/resolve";
import { structure } from "./structure";
import { defaultDocumentNode } from "./defaultDocumentNode";
import { codeInput } from "@sanity/code-input";
import { applyHybridPresetAction } from "./document-actions/apply-hybrid-preset-action";
import { convertPageToPostAction } from "./document-actions/convert-page-to-post-action";
import { generatePostOgAction } from "./document-actions/generate-post-og-action";
import { resetOgSettingsAction } from "./document-actions/reset-og-settings-action";

// Define the actions that should be available for singleton documents
const singletonActions = new Set([
  "publish",
  "discardChanges",
  "restore",
  "unpublish",
]);

// Define the singleton document types
const singletonTypes = new Set([
  "settings",
  "navigation",
  "seoSettings",
  "ogSettings",
  "seoOpsSettings",
  "themeSettings",
]);

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2026-03-23";
const generatorTypes = new Set(["generatorTemplate", "generatorProgram", "generatorDataset"]);
const generatorTemplatesEnabled = dataset === "development";

const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";
const STUDIO_ALLOWED_HOSTS = (
  process.env.SANITY_STUDIO_ALLOWED_HOSTS ||
  "devk.my.id,3333.devk.my.id,.devk.my.id,localhost,127.0.0.1"
)
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

export default defineConfig({
  title: "Schema UI: Starter",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global "New document" menu options
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !singletonTypes.has(schemaType) && (generatorTemplatesEnabled || !generatorTypes.has(schemaType)),
      ),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) => {
      if (context.schemaType === "ogSettings") {
        return [
          resetOgSettingsAction,
          ...input.filter(({ action }) => action && singletonActions.has(action)),
        ];
      }

      if (singletonTypes.has(context.schemaType)) {
        return input.filter(({ action }) => action && singletonActions.has(action));
      }

      if (context.schemaType === "page") {
        return [applyHybridPresetAction, convertPageToPostAction, ...input];
      }

      if (["post", "page", "service", "product", "project"].includes(context.schemaType)) {
        return [generatePostOgAction, ...input];
      }

      return input;
    },
  },
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    media(),
    colorInput(),
    iconPicker(),
  ],
  vite: (prevConfig: any) => ({
    ...prevConfig,
    server: {
      ...prevConfig.server,
      allowedHosts: true,
    },
  }),
});
