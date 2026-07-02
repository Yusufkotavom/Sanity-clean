import { defineType, defineField, defineArrayMember } from "sanity";
import { Layers } from "lucide-react";

export default defineType({
  name: "service-types-block",
  title: "Service Types Block",
  type: "object",
  icon: Layers,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Layanan Website Development Terlengkap",
    description: "Kami menyediakan solusi website lengkap untuk semua kebutuhan bisnis Anda",
    services: [
      {
        _key: "service-type-1",
        title: "Website Company Profile",
        description: "Cocok untuk memperkuat profil bisnis dan kredibilitas online.",
        features: ["Desain profesional", "Responsive", "CTA terarah"],
        price: "Mulai dari konsultasi kebutuhan",
        timeline: "Timeline menyesuaikan scope",
        badge: "Utama",
        link: {
          _type: "link",
          isExternal: true,
          title: "Lihat Detail",
          href: "https://example.com",
          target: false,
        },
      },
    ],
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Layanan Website Development Terlengkap",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      initialValue: "Kami menyediakan solusi website lengkap untuk semua kebutuhan bisnis Anda",
    }),
    defineField({
      name: "services",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "serviceType",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "features",
              type: "array",
              of: [{ type: "string" }],
              description: "List fitur yang disediakan",
            }),
            defineField({
              name: "price",
              type: "string",
              title: "Starting Price",
              description: "Contoh: Mulai Rp 500.000",
            }),
            defineField({
              name: "timeline",
              type: "string",
              description: "Contoh: Timeline: 1-2 minggu",
            }),
            defineField({
              name: "badge",
              type: "string",
              title: "Badge",
              description: "Optional badge (contoh: POPULER)",
            }),
            defineField({
              name: "link",
              type: "link",
            }),
          ],
          preview: {
            select: {
              title: "title",
              price: "price",
            },
            prepare({ title, price }) {
              return {
                title: title || "Service Type",
                subtitle: price || "",
              };
            },
          },
        }),
      ],
    }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Service Types",
        subtitle: title,
      };
    },
  },
});
