import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-2",
  title: "Hero 2",
  type: "object",
  icon: LayoutTemplate,
  initialValue: {
    tagLine: "Partner Teknologi Bisnis",
    title: "Website, Software, dan IT Support dalam satu tim",
    body: [
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
            text: "Pendekatan one-stop untuk operasional dan pemasaran digital: mulai dari development hingga support harian.",
          },
        ],
      },
    ],
    links: [
      {
        _key: "link-1",
        _type: "link",
        isExternal: true,
        title: "Lihat Portofolio",
        href: "/portfolio",
        buttonVariant: "default",
      },
      {
        _key: "link-2",
        _type: "link",
        isExternal: false,
        title: "Hubungi Tim",
        target: false,
        buttonVariant: "link",
      },
    ],
  },
  fields: [
    defineField({
      name: "useCard",
      type: "boolean",
      title: "Use Card Style",
      description: "Display content inside a rounded card style",
      initialValue: true,
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
      initialValue: "transparent",
    }),
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown beside the hero tagline.",
    }),
    defineField({
      name: "title",
      type: "string",
      description: "Optional custom title override. Leave empty to use the page title in frontend.",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
    defineField({
      name: "image",
      title: "Image",
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
      name: "links",
      type: "array",
      of: [{ type: "link" }],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Hero 2",
        subtitle: title,
      };
    },
  },
});
