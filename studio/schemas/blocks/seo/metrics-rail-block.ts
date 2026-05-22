import { defineField, defineType } from "sanity";
import { BarChart3 } from "lucide-react";

export default defineType({
  name: "metrics-rail-block",
  title: "Metrics Rail",
  type: "object",
  icon: BarChart3,
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
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "brand", type: "string", description: "Optional badge label" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { item: "items.0.value" },
    prepare({ item }) {
      return { title: "Metrics Rail", subtitle: item };
    },
  },
});
