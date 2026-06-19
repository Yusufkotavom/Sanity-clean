import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

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
      name: "rows",
      title: "Rows",
      type: "array",
      description: "Each row = 1 page. Contains all data needed for generation (city, keywords, tokens).",
      of: [{ type: "generatorRow" }],
      validation: (Rule) => Rule.required().min(1),
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
      name: "rowCsv",
      title: "Row CSV",
      type: "text",
      rows: 8,
      hidden: ({ document }) => document?.importMode !== "csv-ready",
      description:
        "Paste CSV with header: key,label,service,city,primaryKeyword,secondaryKeywords,industry,offer,localCondition. Use | inside secondaryKeywords for multiple terms.",
    })
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
