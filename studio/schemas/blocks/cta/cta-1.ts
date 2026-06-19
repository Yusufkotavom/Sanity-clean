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
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "backgroundWidth",
      type: "string",
      title: "Background Width",
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
      title: "Use Card Style",
      description: "Display content inside a rounded card style",
      initialValue: true,
    }),
    defineField({
      name: "sectionWidth",
      type: "string",
      title: "Section Width",
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "stackAlign",
      type: "string",
      title: "Stack Layout Alignment",
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown beside the CTA tagline.",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagePosition",
      type: "string",
      title: "Image Position",
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
      validation: (rule) => rule.max(2),
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
