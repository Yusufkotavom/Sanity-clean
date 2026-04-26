import { defineType, defineField } from "sanity";
import { DollarSign } from "lucide-react";

export default defineType({
  name: "pricing-block",
  title: "Pricing Block",
  type: "object",
  icon: DollarSign,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Paket Harga",
    description: "Pilih paket yang sesuai dengan kebutuhan bisnis Anda",
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
      initialValue: "Paket Harga",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Pilih paket yang sesuai dengan kebutuhan bisnis Anda",
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Pricing Category",
      description: "Select which pricing packages to display",
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
        title: "Pricing",
        subtitle: `${title} - ${category}`,
      };
    },
  },
});
