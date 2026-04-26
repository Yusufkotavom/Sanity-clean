import { defineType, defineField } from "sanity";
import { MessageSquareQuote } from "lucide-react";

export default defineType({
  name: "testimonials-block",
  title: "Testimonials Block",
  type: "object",
  icon: MessageSquareQuote,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Apa Kata Klien Kami",
    description: "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom",
    category: "",
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
      initialValue: "Apa Kata Klien Kami",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom",
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Filter by Category",
      description: "Leave empty to show all testimonials",
      options: {
        list: [
          { title: "All", value: "" },
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "Printing", value: "printing" },
        ],
        layout: "radio",
      },
      initialValue: "",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
    },
    prepare({ title, category }) {
      return {
        title: "Testimonials",
        subtitle: category ? `${title} - ${category}` : title,
      };
    },
  },
});
