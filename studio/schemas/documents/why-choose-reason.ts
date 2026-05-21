import { defineType, defineField } from "sanity";
import { Award } from "lucide-react";

export default defineType({
  name: "whyChooseReason",
  title: "Why Choose Reason",
  type: "document",
  icon: Award,
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
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Award", value: "award" },
          { title: "Heart Handshake", value: "heart-handshake" },
          { title: "Shield", value: "shield" },
          { title: "Trending Up", value: "trending-up" },
          { title: "Check Circle", value: "check-circle" },
          { title: "Star", value: "star" },
          { title: "Zap", value: "zap" },
          { title: "Users", value: "users" },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      subtitle: "description",
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