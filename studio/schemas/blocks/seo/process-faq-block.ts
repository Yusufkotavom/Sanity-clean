import { defineField, defineType } from "sanity";
import { ListOrdered } from "lucide-react";

export default defineType({
  name: "process-faq-block",
  title: "Process + FAQ",
  type: "object",
  icon: ListOrdered,
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
      name: "processTitle",
      type: "string",
      initialValue: "Bagaimana proyek ini berjalan",
    }),
    defineField({
      name: "processSteps",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: "faqTitle",
      type: "string",
      initialValue: "Pertanyaan yang sering muncul",
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "processTitle" },
    prepare({ title }) {
      return { title: "Process + FAQ", subtitle: title };
    },
  },
});
