import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";

export default defineType({
  name: "grid-card",
  type: "object",
  icon: LayoutGrid,
  initialValue: {
    cardStyle: "vercel",
    title: "Website Development",
    excerpt: [
      {
        _key: "body-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "body-1-span-1",
            _type: "span",
            marks: [],
            text: "Pembuatan website profesional, cepat, dan responsif untuk company profile, landing page, hingga portal bisnis.",
          },
        ],
      },
    ],
    link: {
      _type: "link",
      isExternal: true,
      title: "Lihat Detail",
      href: "/services/website-development",
      buttonVariant: "link",
    },
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "uiIcon",
      group: "content",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown on top of the card heading.",
    }),
    defineField({
      name: "title",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      group: "content",
      type: "block-content",
    }),
    defineField({
      name: "image",
      group: "content",
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
      group: "content",
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
