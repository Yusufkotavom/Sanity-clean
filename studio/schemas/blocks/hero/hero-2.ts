import { defineField, defineType, defineArrayMember } from "sanity";
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
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroImage",
          fields: [
            defineField({
              name: "image",
              type: "image",
              title: "Image",
              options: { hotspot: true },
              fields: [
                { name: "alt", type: "string", title: "Alternative Text" },
              ],
            }),
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "description", type: "text", title: "Description", rows: 2 }),
            defineField({ name: "link", type: "link", title: "Link (entire image)" }),
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare({ title, media }: { title?: string; media?: any }) {
              return { title: title || "Hero Image", media };
            },
          },
        }),
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
    prepare({ title }: { title?: string }) {
      return {
        title: "Hero 2",
        subtitle: title,
      };
    },
  },
});
