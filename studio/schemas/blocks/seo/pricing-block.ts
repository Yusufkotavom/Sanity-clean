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
      name: "tabs",
      type: "object",
      groups: [
        { name: "content", title: "Content" },
        { name: "style", title: "Style" },
      ],
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Title",
          group: "content",
          initialValue: "Paket Harga",
        }),
        defineField({
          name: "description",
          type: "text",
          rows: 2,
          group: "content",
          initialValue: "Pilih paket yang sesuai dengan kebutuhan bisnis Anda",
        }),
        defineField({
          name: "category",
          type: "string",
          title: "Pricing Category",
          group: "content",
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
        defineField({
          name: "padding",
          type: "section-padding",
          group: "style",
        }),
        defineField({
          name: "colorVariant",
          type: "color-variant",
          title: "Background",
          group: "style",
        }),
      ],
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
