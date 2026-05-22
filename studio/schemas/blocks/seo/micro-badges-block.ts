import { defineField, defineType } from "sanity";
import { BadgeCheck } from "lucide-react";

export default defineType({
  name: "micro-badges-block",
  title: "Micro Badges",
  type: "object",
  icon: BadgeCheck,
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
      name: "badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", type: "string" }),
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { badge: "badges.0.label" },
    prepare({ badge }) {
      return { title: "Micro Badges", subtitle: badge };
    },
  },
});
