import { defineField, defineType } from "sanity";

export default defineType({
  name: "generatorSectionVariant",
  title: "Generator Section Variant",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sectionType",
      title: "Section Type",
      type: "string",
      description: "Simple identifier for the future renderer.",
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "requiredTokens",
      title: "Required Tokens",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "optional",
      title: "Optional",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sectionType",
    },
  },
});
