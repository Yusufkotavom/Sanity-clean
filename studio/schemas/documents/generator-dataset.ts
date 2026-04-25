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
    defineField({
      name: "keywordSets",
      title: "Keyword Sets",
      type: "array",
      of: [{ type: "generatorKeywordSet" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((value) => validateUniqueObjectKeys(value, "Keyword set")),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "generatorRow" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((value) => validateUniqueObjectKeys(value, "Row")),
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
    },
  },
});
