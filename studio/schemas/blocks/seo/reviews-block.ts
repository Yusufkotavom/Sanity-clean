import { defineField, defineType } from "sanity";
import { Star } from "lucide-react";

export default defineType({
  name: "reviews-block",
  title: "Reviews Section",
  type: "object",
  icon: Star,
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
      name: "title",
      type: "string",
      initialValue: "Ulasan Pelanggan",
    }),
    defineField({
      name: "reviews",
      type: "array",
      of: [{ type: "review-item" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "Reviews", subtitle: title };
    },
  },
});
