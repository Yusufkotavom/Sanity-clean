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
