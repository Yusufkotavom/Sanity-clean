import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "generatorProgram",
  title: "Generator Program",
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
    orderRankField({ type: "generatorProgram" }),
    defineField({
      name: "template",
      title: "Template",
      type: "reference",
      to: [{ type: "generatorTemplate" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "templatePool",
      title: "Template Pool",
      type: "array",
      description:
        "Optional: choose 1–3 templates for deterministic per-row variation. If empty, the single Template field is used.",
      of: [
        defineField({
          name: "template",
          type: "reference",
          to: [{ type: "generatorTemplate" }],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "dataset",
      title: "Dataset",
      type: "reference",
      to: [{ type: "generatorDataset" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "generationMode",
      title: "Generation Mode",
      type: "string",
      options: {
        list: [
          { title: "Preview", value: "preview" },
          { title: "Batch", value: "batch" },
        ],
        layout: "radio",
      },
      initialValue: "preview",
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
          { title: "Paused", value: "paused" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aiMode",
      title: "AI Mode",
      type: "string",
      options: {
        list: [
          { title: "Off", value: "off" },
          { title: "Prepared", value: "prepared" },
        ],
        layout: "radio",
      },
      initialValue: "off",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
    },
    prepare({ title, status }) {
      return {
        title: title || "Generator Program",
        subtitle: status || "draft",
      };
    },
  },
});
