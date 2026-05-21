import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";

export default defineType({
  name: "serviceCluster",
  title: "Service Cluster",
  type: "document",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "priceHint",
      title: "Price Hint",
      type: "string",
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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceHint",
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