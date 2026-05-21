import { defineField, defineType } from "sanity";
import { HelpCircle } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "IT Support", value: "support" },
          { title: "Printing", value: "printing" },
          { title: "Pricing", value: "pricing" },
        ],
      },
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
    orderRankField({ type: "faq" }),
  ],

  orderings: [
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "question",
      subtitle: "category",
    },
  },
});
