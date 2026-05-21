import { defineType, defineField } from "sanity";
import { Layers } from "lucide-react";

export default defineType({
  name: "serviceLane",
  title: "Service Lane",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "Support", value: "support" },
          { title: "Printing", value: "printing" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bullets",
      title: "Bullet Points",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
      },
      initialValue: "active",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Key",
      name: "keyAsc",
      by: [{ field: "key", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "key",
      order: "order",
    },
    prepare({ title, subtitle, order }) {
      return {
        title,
        subtitle: `${order ? `#${order} - ` : ""}${subtitle}`,
      };
    },
  },
});