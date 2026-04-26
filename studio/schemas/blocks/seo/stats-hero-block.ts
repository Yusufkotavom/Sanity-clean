import { defineType, defineField } from "sanity";
import { TrendingUp } from "lucide-react";

export default defineType({
  name: "stats-hero-block",
  title: "Stats Hero Block",
  type: "object",
  icon: TrendingUp,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    eyebrow: "200+ proyek berjalan",
    title: "Fondasi visual yang membantu visitor lebih cepat paham",
    description: "Gabungkan headline, angka, dan CTA untuk memberi konteks lebih kuat di area atas halaman.",
    links: [
      {
        _key: "stats-hero-link-1",
        _type: "link",
        isExternal: true,
        title: "Pelajari Lebih Lanjut",
        href: "https://example.com",
        target: false,
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
      name: "eyebrow",
      type: "string",
      title: "Eyebrow Text",
      description: "Text kecil di atas title (contoh: 200+ Website Sukses Dibuat)",
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
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
      eyebrow: "eyebrow",
    },
    prepare({ title, eyebrow }) {
      return {
        title: "Stats Hero",
        subtitle: eyebrow || title,
      };
    },
  },
});
