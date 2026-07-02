import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export default defineType({
  name: "all-posts",
  type: "object",
  title: "All Posts",
  description: "Content listing block for posts, services, products, and projects",
  icon: Newspaper,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    displayMode: "default",
    contentTypes: ["post"],
    limit: 6,
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "displayMode",
      group: "content",
      type: "string",
      title: "Display Mode",
      options: {
        list: [
          { title: "Default Grid", value: "default" },
          { title: "Carousel", value: "carousel" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentTypes",
      group: "content",
      type: "array",
      title: "Content Types",
      description: "Choose which document types to show in this listing.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Post", value: "post" },
          { title: "Service", value: "service" },
          { title: "Product", value: "product" },
          { title: "Project", value: "project" },
        ],
      },
      initialValue: ["post"],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "limit",
      group: "content",
      type: "number",
      title: "Item Limit",
      initialValue: 6,
      validation: (Rule) => Rule.required().min(1).max(24),
    }),
      defineField({
            name: "blockStyles",
      group: "style",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      mode: "displayMode",
      contentTypes: "contentTypes",
      limit: "limit",
    },
    prepare({ mode, contentTypes, limit }) {
      const selected = Array.isArray(contentTypes) && contentTypes.length > 0
        ? contentTypes.join(", ")
        : "post";
      return {
        title: "All Posts",
        subtitle: `${mode || "default"} · ${selected} · limit ${limit || 6}`,
      };
    },
  },
});
