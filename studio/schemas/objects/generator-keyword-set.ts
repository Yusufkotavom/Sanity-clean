import { defineField, defineType } from "sanity";

export default defineType({
  name: "generatorKeywordSet",
  title: "Generator Keyword Set",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: "Stable lineage key used by generated page metadata.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary Keyword",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary Keywords",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "angle",
      title: "Angle",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "key",
      primaryKeyword: "primaryKeyword",
    },
    prepare({ title, subtitle, primaryKeyword }) {
      return {
        title: title,
        subtitle: [subtitle, primaryKeyword].filter(Boolean).join(" · "),
      };
    },
  },
});
