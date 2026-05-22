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
      description: "Konteks lokal unik kota ini (ekonomi, kebutuhan, karakteristik) untuk diferensiasi konten.",
    }),
    defineField({
      name: "tokens",
      title: "Custom Tokens",
      type: "array",
      description: "Dynamic token data. Each token can be a single value or multiple values (rotate). Use {{tokenName}} in template.",
      of: [
        {
          type: "object",
          name: "customToken",
          fields: [
            defineField({
              name: "name",
              title: "Token Name",
              type: "string",
              description: "Used as {{name}} in template blocks",
              validation: (Rule) => Rule.required().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { name: "token name", invert: false }),
            }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [{ type: "string" }],
              description: "Single value = static. Multiple values = engine picks/rotates.",
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
    },
    prepare({ title, key, city }) {
      return {
        title: title || key || "Generator Row",
        subtitle: city || key || "Row",
      };
    },
  },
});
