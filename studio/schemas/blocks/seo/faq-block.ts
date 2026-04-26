import { defineType, defineField } from "sanity";
import { HelpCircle } from "lucide-react";

export default defineType({
  name: "faq-block",
  title: "FAQ Block",
  type: "object",
  icon: HelpCircle,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Pertanyaan yang Sering Diajukan",
    description: "Temukan jawaban untuk pertanyaan umum seputar layanan kami",
    category: "website",
  },
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
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
      name: "category",
      type: "string",
      title: "FAQ Category",
      description: "Select which FAQ category to display",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "Printing", value: "printing" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
    },
    prepare({ title, category }) {
      return {
        title: "FAQ",
        subtitle: `${title} - ${category}`,
      };
    },
  },
});
