import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-1",
  title: "Hero 1",
  type: "object",
  icon: LayoutTemplate,
  initialValue: {
    tagLine: "Layanan IT Terpadu",
    title: "Solusi IT & Digital untuk pertumbuhan bisnis Anda",
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
            text: "Fokus pada bisnis Anda, kami tangani website, software, infrastruktur IT, dan kebutuhan digital harian Anda.",
          },
        ],
      },
    ],
    links: [
      {
        _key: "link-1",
        _type: "link",
        isExternal: true,
        title: "Jelajahi Layanan",
        href: "/services",
        buttonVariant: "default",
      },
      {
        _key: "link-2",
        _type: "link",
        isExternal: false,
        title: "Diskusikan Kebutuhan",
        target: false,
        buttonVariant: "outline",
      },
    ],
  },
  groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
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
          title: "Image",
          type: "image",
          group: "content",
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
          group: "content",
          validation: (rule) => rule.max(2),
        }),
        defineField({
          name: "useCard",
          type: "boolean",
          title: "Card Style",
          description: "Display content inside a rounded card",
          group: "style",
          initialValue: true,
        }),
        defineField({
          name: "imagePosition",
          type: "string",
          title: "Image Position",
          group: "style",
          options: {
            list: [
              { title: "Right", value: "right" },
              { title: "Left", value: "left" },
            ],
            layout: "radio",
          },
          initialValue: "right",
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
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Hero 1",
        subtitle: title,
      };
    },
  },
});
