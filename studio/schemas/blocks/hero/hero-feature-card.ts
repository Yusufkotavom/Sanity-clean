import { defineField, defineType } from "sanity";
import { PanelsTopLeft } from "lucide-react";

export default defineType({
  name: "hero-feature-card",
  title: "Hero Feature Card",
  type: "object",
  icon: PanelsTopLeft,
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "uiIcon",
      group: "content",
      title: "Icon",
      type: "ui-icon",
      description: "Icon shown in the top area of the card.",
    }),
    defineField({
      name: "title",
      group: "content",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(90),
    }),
    defineField({
      name: "description",
      group: "content",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "link",
      group: "content",
      title: "Link",
      type: "link",
      description: "Optional link to navigate when the card is clicked.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Hero Feature Card",
        subtitle: subtitle || "No description",
      };
    },
  },
});
