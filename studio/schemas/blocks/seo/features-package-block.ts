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
  groups: [
    { name: "content", title: "Content" },
    { name: "layout", title: "Layout" },
    { name: "style", title: "Style" },
  ],
  fields: [
        defineField({ name: "title", type: "string", title: "Title", group: "content" }),
        defineField({ name: "subtitle", type: "string", title: "Subtitle", group: "content" }),
        defineField({ name: "description", type: "text", rows: 2, group: "content" }),
        defineField({
          name: "features",
          title: "Items",
          type: "array",
          group: "content",
          of: [
            defineArrayMember({
              type: "object",
              name: "feature",
              fields: [
                defineField({ name: "icon", type: "ui-icon", title: "Icon" }),
                defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
                defineField({ name: "description", type: "text", rows: 2 }),
                defineField({ name: "badge", type: "string", title: "Badge" }),
                defineField({ name: "link", type: "link", title: "Link" }),
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
          group: "content",
        }),
        defineField({
          name: "cardStyle",
          type: "string",
          title: "Card Style",
          group: "layout",
          options: {
            list: [
              { title: "Grid", value: "grid" },
              { title: "List", value: "list" },
              { title: "Numbered", value: "numbered" },
            ],
            layout: "radio",
          },
          initialValue: "grid",
        }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            group: "style",
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: { title: "title", cardStyle: "cardStyle" },
    prepare({ title, cardStyle }: { title?: string; cardStyle?: string }) {
      return { title: "Features / Value Props", subtitle: `${cardStyle || "grid"} · ${title || ""}` };
    },
  },
});
