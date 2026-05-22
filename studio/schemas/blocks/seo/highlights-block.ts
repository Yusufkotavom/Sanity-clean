import { defineField, defineType } from "sanity";
import { List } from "lucide-react";

export default defineType({
  name: "highlights-block",
  title: "Highlights",
  type: "object",
  icon: List,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
    }),
    defineField({
      name: "eyebrow",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "Highlights", subtitle: title };
    },
  },
});
