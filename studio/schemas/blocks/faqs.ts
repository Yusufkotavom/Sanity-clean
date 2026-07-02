import { defineType, defineField } from "sanity";
import { ListCollapse } from "lucide-react";

export default defineType({
  name: "faqs",
  type: "object",
  icon: ListCollapse,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    source: "reference",
    title: "Pertanyaan yang Sering Diajukan",
    description: "Temukan jawaban untuk pertanyaan umum seputar layanan kami",
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Pertanyaan yang Sering Diajukan",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Temukan jawaban untuk pertanyaan umum seputar layanan kami",
    }),
    defineField({
      name: "source",
      type: "string",
      title: "Data Source",
      options: {
        list: [
          { title: "Reference (FAQ Documents)", value: "reference" },
          { title: "Manual Input", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "reference",
    }),
    defineField({
      name: "faqs",
      type: "array",
      title: "FAQ Documents",
      of: [
        {
          name: "faq",
          type: "reference",
          to: [{ type: "faq" }],
        },
      ],
      hidden: ({ parent }) => parent?.source !== "reference",
    }),
    defineField({
      name: "manualItems",
      title: "FAQ Items",
      type: "array",
      of: [{ type: "faqItem" }],
      hidden: ({ parent }) => parent?.source !== "manual",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.source === "manual" && (!value || value.length === 0)) {
            return "Add at least one FAQ item when source is Manual";
          }
          return true;
        }),
    }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      title: "title",
      source: "source",
    },
    prepare({ title, source }) {
      return {
        title: "FAQs",
        subtitle: `${title || ""} (${source === "manual" ? "Manual" : "Reference"})`,
      };
    },
  },
});
