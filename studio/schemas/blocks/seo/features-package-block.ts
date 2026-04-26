import { defineType, defineField, defineArrayMember } from "sanity";
import { Package } from "lucide-react";

export default defineType({
  name: "features-package-block",
  title: "Features Package Block",
  type: "object",
  icon: Package,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Paket Lengkap",
    subtitle: "Apa Yang Akan Anda Dapatkan?",
    description: "Lebih dari sekadar website, Anda mendapatkan solusi digital lengkap untuk bisnis Anda",
    features: [
      {
        _key: "feature-1",
        icon: "🛠️",
        title: "Setup inti siap jalan",
        description: "Konfigurasi dasar disiapkan agar proyek bisa langsung dipakai.",
      },
      {
        _key: "feature-2",
        icon: "📊",
        title: "Fondasi optimasi",
        description: "Struktur awal dibangun agar mudah dikembangkan dan diukur hasilnya.",
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
      initialValue: "Paket Lengkap",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      initialValue: "Apa Yang Akan Anda Dapatkan?",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Lebih dari sekadar website, Anda mendapatkan solusi digital lengkap untuk bisnis Anda",
    }),
    defineField({
      name: "features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              title: "Icon (Emoji)",
              description: "Emoji icon untuk feature ini",
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
              description: "Text untuk badge (contoh: Meta Tags & Schema Markup)",
            }),
          ],
          preview: {
            select: {
              title: "title",
              icon: "icon",
            },
            prepare({ title, icon }) {
              return {
                title: title || "Feature",
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
        title: "Features Package",
        subtitle: title,
      };
    },
  },
});
