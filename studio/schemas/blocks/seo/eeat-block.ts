import { defineField, defineType } from "sanity";
import { ShieldCheck } from "lucide-react";

export default defineType({
  name: "eeat-block",
  title: "E-E-A-T Section",
  type: "object",
  icon: ShieldCheck,
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
      initialValue: "E-E-A-T",
    }),
    defineField({
      name: "title",
      type: "string",
      initialValue: "Kredibilitas & Kepercayaan",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "points",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "E-E-A-T Section", subtitle: title };
    },
  },
});
