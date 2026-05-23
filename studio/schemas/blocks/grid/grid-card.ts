import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";

export default defineType({
  name: "grid-card",
  type: "object",
  icon: LayoutGrid,
  initialValue: {
    cardStyle: "vercel",
    title: "Website Development",
    excerpt:
      "Pembuatan website profesional, cepat, dan responsif untuk company profile, landing page, hingga portal bisnis.",
    link: {
      _type: "link",
      isExternal: true,
      title: "Lihat Detail",
      href: "/services/website-development",
      buttonVariant: "link",
    },
  },
  fields: [
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown on top of the card heading.",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      type: "text",
    }),
    defineField({
      name: "image",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "link",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: "Grid Card",
        subtitle: title || "No title",
        media,
      };
    },
  },
});
