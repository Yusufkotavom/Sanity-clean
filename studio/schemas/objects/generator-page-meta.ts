import { defineField, defineType } from "sanity";

export default defineType({
  name: "generatorPageMeta",
  title: "Generator Page Meta",
  type: "object",
  fields: [
    defineField({
      name: "programId",
      title: "Program ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "program",
      title: "Program Reference",
      type: "reference",
      to: [{ type: "generatorProgram" }],
      readOnly: true,
      weak: true,
    }),
    defineField({
      name: "templateId",
      title: "Template ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "template",
      title: "Template Reference",
      type: "reference",
      to: [{ type: "generatorTemplate" }],
      readOnly: true,
      weak: true,
    }),
    defineField({
      name: "datasetId",
      title: "Dataset ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "dataset",
      title: "Dataset Reference",
      type: "reference",
      to: [{ type: "generatorDataset" }],
      readOnly: true,
      weak: true,
    }),
    defineField({
      name: "rowKey",
      title: "Row Key",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "keywordKey",
      title: "Keyword Key",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "generatedAt",
      title: "Generated At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "aiUsed",
      title: "AI Used",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: false,
  },
});
