import { defineField, defineType } from "sanity";
import { Link2 } from "lucide-react";

export default defineType({
  name: "related-links-block",
  title: "Related Links",
  type: "object",
  icon: Link2,
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
      initialValue: "Halaman Terkait",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "title", subtitle: "href" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "Related Links", subtitle: title };
    },
  },
});
