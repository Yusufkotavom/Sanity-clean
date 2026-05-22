import { defineField, defineType } from "sanity";

export default defineType({
  name: "generatorRow",
  title: "Generator Row",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary Keyword",
      type: "string",
      description: "Main keyword for this page. Used in title, H1, meta.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Supporting keywords. Engine rotates these across page sections.",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
    }),
    defineField({
      name: "offer",
      title: "Offer",
      type: "string",
    }),
    defineField({
      name: "localCondition",
      title: "Local Condition",
      type: "string",
      description: "Konteks lokal unik kota ini untuk diferensiasi konten.",
    }),
    defineField({
      name: "tokens",
      title: "Custom Tokens",
      type: "array",
      description: "Dynamic token data. Use {{tokenName}} in template. Multiple values = rotate.",
      of: [
        {
          type: "object",
          name: "customToken",
          fields: [
            defineField({
              name: "name",
              title: "Token Name",
              type: "string",
              validation: (Rule) => Rule.required().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { name: "token name", invert: false }),
            }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "name", values: "values" },
            prepare({ title, values }) {
              const count = values?.length || 0;
              return {
                title: `{{${title}}}`,
                subtitle: count === 1 ? values[0] : `${count} values (rotate)`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "label",
      key: "key",
      city: "city",
      primaryKeyword: "primaryKeyword",
    },
    prepare({ title, key, city, primaryKeyword }) {
      return {
        title: title || primaryKeyword || key || "Generator Row",
        subtitle: city || key || "Row",
      };
    },
  },
});
