import { defineType, defineField, defineArrayMember } from "sanity";
import { Package } from "lucide-react";

export default defineType({
  name: "features-package-block",
  title: "Features / Value Props",
  type: "object",
  icon: Package,
  initialValue: {
    padding: { _type: "section-padding", top: true, bottom: true },
    colorVariant: "background",
    cardStyle: "grid",
    title: "Paket Lengkap",
    subtitle: "Apa Yang Akan Anda Dapatkan?",
  },
  fields: [
    defineField({ name: "padding", type: "section-padding" }),
    defineField({ name: "colorVariant", type: "color-variant", title: "Color Variant" }),
    defineField({
      name: "cardStyle",
      type: "string",
      title: "Card Style",
      options: {
        list: [
          { title: "Grid (icon + title + desc)", value: "grid" },
          { title: "List (compact, no card border)", value: "list" },
          { title: "Numbered (step-style)", value: "numbered" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({ name: "icon", type: "ui-icon", title: "Icon" }),
            defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({ name: "badge", type: "string", title: "Badge" }),
            defineField({ name: "link", type: "link", title: "Link (entire card)" }),
          ],
          preview: {
            select: { title: "title", icon: "icon" },
            prepare({ title, icon }: { title?: string; icon?: any }) {
              return {
                title: title || "Item",
                subtitle: icon?.name || "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA Button",
      type: "link",
      description: "Optional call-to-action button below the features.",
    }),
  ],
  preview: {
    select: { title: "title", cardStyle: "cardStyle" },
    prepare({ title, cardStyle }: { title?: string; cardStyle?: string }) {
      return { title: "Features / Value Props", subtitle: `${cardStyle || "grid"} · ${title || ""}` };
    },
  },
});
