import { defineField, defineType } from "sanity";
import { Captions } from "lucide-react";
import { STACK_ALIGN, SECTION_WIDTH } from "../shared/layout-variants";

export default defineType({
  name: "cta-1",
  title: "CTA 1",
  type: "object",
  icon: Captions,
  initialValue: {
    colorVariant: "primary",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine: "Konsultasi Gratis",
    title: "Ceritakan kebutuhan bisnis Anda, kami siapkan solusi yang relevan",
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
            text: "Dapatkan rekomendasi teknis, estimasi budget, dan langkah implementasi yang realistis untuk tim Anda.",
          },
        ],
      },
    ],
    links: [
      {
        _key: "link-1",
        _type: "link",
        isExternal: false,
        title: "Diskusikan Kebutuhan",
        target: false,
        buttonVariant: "default",
      },
      {
        _key: "link-2",
        _type: "link",
        isExternal: true,
        title: "Lihat Semua Layanan",
        href: "/services",
        buttonVariant: "outline",
      },
    ],
  },
  fields: [
    defineField({
      name: "tabs",
      type: "object",
      groups: [
        { name: "content", title: "Content" },
        { name: "layout", title: "Layout" },
        { name: "style", title: "Style" },
      ],
      fields: [
        defineField({
          name: "tagLine",
          type: "string",
          title: "Tagline",
          group: "content",
        }),
        defineField({
          name: "uiIcon",
          title: "Icon",
          type: "ui-icon",
          group: "content",
        }),
        defineField({
          name: "title",
          type: "string",
          title: "Title",
          group: "content",
        }),
        defineField({
          name: "body",
          type: "block-content",
          group: "content",
        }),
        defineField({
          name: "image",
          type: "image",
          title: "Image",
          group: "content",
          options: { hotspot: true },
        }),
        defineField({
          name: "imagePosition",
          type: "string",
          title: "Image Position",
          group: "content",
          options: {
            list: [
              { title: "Top", value: "top" },
              { title: "Left", value: "left" },
            ],
            layout: "radio",
          },
          initialValue: "top",
          hidden: ({ parent }) => !parent?.image,
        }),
        defineField({
          name: "links",
          type: "array",
          of: [{ type: "link" }],
          group: "content",
          validation: (rule) => rule.max(2),
        }),
        defineField({
          name: "backgroundWidth",
          type: "string",
          title: "Background Width",
          group: "layout",
          options: {
            list: [
              { title: "Compact", value: "compact" },
              { title: "Full Width", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "compact",
        }),
        defineField({
          name: "useCard",
          type: "boolean",
          title: "Card Style",
          description: "Display content inside a rounded card",
          group: "layout",
          initialValue: true,
        }),
        defineField({
          name: "sectionWidth",
          type: "string",
          title: "Section Width",
          group: "layout",
          options: {
            list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
            layout: "radio",
          },
          initialValue: "default",
        }),
        defineField({
          name: "stackAlign",
          type: "string",
          title: "Alignment",
          group: "layout",
          options: {
            list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
            layout: "radio",
          },
          initialValue: "left",
        }),
        defineField({
          name: "padding",
          type: "section-padding",
          group: "style",
        }),
        defineField({
          name: "colorVariant",
          type: "color-variant",
          title: "Background",
          group: "style",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "CTA 1",
        subtitle: title,
      };
    },
  },
});
