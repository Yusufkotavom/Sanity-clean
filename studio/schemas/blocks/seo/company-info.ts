import { defineType, defineField } from "sanity";
import { Building2 } from "lucide-react";

export default defineType({
  name: "company-info",
  title: "Company Info",
  type: "object",
  icon: Building2,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Tentang Kotacom",
    description: "Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015",
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
      initialValue: "Tentang Kotacom",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      initialValue: "Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Company Info",
        subtitle: title || "Trust Signals",
      };
    },
  },
});
