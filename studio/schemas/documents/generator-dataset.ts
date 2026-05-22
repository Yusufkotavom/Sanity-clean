import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const validateUniqueObjectKeys = (value: unknown, label: string) => {
  if (!Array.isArray(value)) {
    return true;
  }

  const seen = new Set<string>();
  for (const entry of value) {
    const key = typeof entry === "object" && entry !== null ? (entry as { key?: unknown }).key : undefined;
    if (typeof key !== "string" || key.length === 0) {
      continue;
    }
    if (seen.has(key)) {
      return `${label} keys must be unique.`;
    }
    seen.add(key);
  }

  return true;
};

const hasCsvInput = (value: unknown) =>
  typeof value === "string" && value.trim().split(/\r?\n/).filter(Boolean).length >= 2;

const validateDatasetArray = (
  fieldLabel: "Keyword set" | "Row",
  csvField: "keywordSetCsv" | "rowCsv",
  value: unknown,
  context: { parent?: unknown },
) => {
  const parent = (context.parent ?? {}) as {
    importMode?: unknown;
    keywordSetCsv?: unknown;
    rowCsv?: unknown;
  };
  const importMode = typeof parent.importMode === "string" ? parent.importMode : "manual";

  if (importMode === "csv-ready" && hasCsvInput(parent[csvField])) {
    return validateUniqueObjectKeys(value, fieldLabel);
  }

  if (!Array.isArray(value) || value.length === 0) {
    return `${fieldLabel}${fieldLabel === "Row" ? "s" : "s"} must contain at least one item.`;
  }

  return validateUniqueObjectKeys(value, fieldLabel);
};

export default defineType({
  name: "generatorDataset",
  title: "Generator Dataset",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "generatorDataset" }),
    defineField({
      name: "keywordSets",
      title: "Keyword Sets",
      type: "array",
      description:
        "Manual mode: edit directly here. CSV Ready mode: this array will be filled by the dataset CSV sync script.",
      of: [{ type: "generatorKeywordSet" }],
      validation: (Rule) =>
        Rule.custom((value, context) => validateDatasetArray("Keyword set", "keywordSetCsv", value, context)),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      description:
        "Manual mode: edit directly here. CSV Ready mode: this array will be filled by the dataset CSV sync script.",
      of: [{ type: "generatorRow" }],
      validation: (Rule) =>
        Rule.custom((value, context) => validateDatasetArray("Row", "rowCsv", value, context)),
    }),
    defineField({
      name: "importMode",
      title: "Import Mode",
      type: "string",
      options: {
        list: [
          { title: "Manual", value: "manual" },
          { title: "CSV Ready", value: "csv-ready" },
        ],
        layout: "radio",
      },
      initialValue: "manual",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "keywordSetCsv",
      title: "Keyword Set CSV",
      type: "text",
      rows: 8,
      hidden: ({ document }) => document?.importMode !== "csv-ready",
      description:
        "Paste CSV with header: key,label,primaryKeyword,secondaryKeywords,angle. Use | inside secondaryKeywords for multiple terms.",
    }),
    defineField({
      name: "rowCsv",
      title: "Row CSV",
      type: "text",
      rows: 8,
      hidden: ({ document }) => document?.importMode !== "csv-ready",
      description:
        "Paste CSV with header: key,label,service,city,industry,offer,localCondition. Run the sync script to convert pasted CSV into Rows.",
    }),
    defineField({
      name: "dedupePolicy",
      title: "Dedupe Policy",
      type: "string",
      options: {
        list: [
          { title: "Skip Existing Slug", value: "skip-existing-slug" },
          { title: "Flag Conflict", value: "flag-conflict" },
        ],
        layout: "radio",
      },
      initialValue: "skip-existing-slug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Ready", value: "ready" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "devOnly",
      title: "Dev Only",
      type: "boolean",
      initialValue: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      importMode: "importMode",
    },
    prepare({ title, subtitle, importMode }) {
      return {
        title: title || "Generator Dataset",
        subtitle: [importMode, subtitle].filter(Boolean).join(" · "),
      };
    },
  },
});
