import { defineType, defineField, defineArrayMember } from "sanity";
import { Sparkles } from "lucide-react";

export default defineType({
  name: "benefits-block",
  title: "Benefits Block",
  type: "object",
  icon: Sparkles,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Keuntungan Website",
    subtitle: "Mengapa Anda Harus Memiliki Website?",
    description: "Website bukan lagi pilihan, tapi kebutuhan utama untuk bisnis modern di era digital",
    benefits: [
      {
        _key: "benefit-1",
        icon: "🚀",
        title: "Mudah ditemukan calon pelanggan",
        description: "Website membantu bisnis tampil lebih profesional dan lebih mudah dicari.",
      },
      {
        _key: "benefit-2",
        icon: "📈",
        title: "Mendukung pertumbuhan penjualan",
        description: "Konten dan CTA yang tepat membantu mengubah traffic menjadi peluang bisnis.",
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
      name: "title",
      type: "string",
      initialValue: "Keuntungan Website",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      initialValue: "Mengapa Anda Harus Memiliki Website?",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Website bukan lagi pilihan, tapi kebutuhan utama untuk bisnis modern di era digital",
    }),
    defineField({
      name: "benefits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "benefit",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              title: "Icon (Emoji)",
              description: "Emoji icon untuk benefit ini",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "badge",
              type: "string",
              title: "Badge Text",
              description: "Text untuk badge (contoh: 200% Peningkatan rata-rata omset)",
            }),
            defineField({
              name: "badgeIcon",
              type: "string",
              title: "Badge Icon (Emoji)",
              description: "Emoji icon untuk badge",
            }),
          ],
          preview: {
            select: {
              title: "title",
              icon: "icon",
            },
            prepare({ title, icon }) {
              return {
                title: title || "Benefit",
                subtitle: icon || "",
              };
            },
          },
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
        title: "Benefits Block",
        subtitle: title,
      };
    },
  },
});
