import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

export default defineType({
  name: "serviceType",
  title: "Service Type",
  type: "document",
  icon: Tag,
  description: "Service types for location-based pages (reference data only, not standalone pages)",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    orderRankField({ type: "serviceType" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Parent category (e.g., software, percetakan, pembuatan-website)",
      options: {
        list: [
          { title: "Software", value: "software" },
          { title: "Percetakan", value: "percetakan" },
          { title: "Pembuatan Website", value: "pembuatan-website" },
          { title: "Sistem POS", value: "sistem-pos" },
          { title: "Layanan", value: "layanan" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Category is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief description of this service type",
    }),
    defineField({
      name: "defaultTemplate",
      title: "Default Template",
      type: "reference",
      description: "Default page template for this service type (can be overridden per location)",
      to: [{ type: "pageTemplate" }],
    }),
    defineField({
      name: "pricing",
      title: "Pricing Info",
      type: "object",
      fields: [
        defineField({
          name: "startingPrice",
          title: "Starting Price",
          type: "number",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: {
            list: [
              { title: "IDR", value: "IDR" },
              { title: "USD", value: "USD" },
            ],
          },
          initialValue: "IDR",
        }),
        defineField({
          name: "duration",
          title: "Estimated Duration",
          type: "string",
          description: "Example: 2 weeks, 1 month, 3 days",
        }),
      ],
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      slug: "slug.current",
    },
    prepare({ title, category, slug }) {
      return {
        title: title || "Untitled",
        subtitle: category ? `${category} / ${slug}` : slug,
      };
    },
  },
  orderings: [
    {
      title: "Category, A-Z",
      name: "categoryAsc",
      by: [
        { field: "category", direction: "asc" },
        { field: "sortOrder", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
