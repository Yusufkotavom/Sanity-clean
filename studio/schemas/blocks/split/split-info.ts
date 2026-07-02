import { defineField, defineType } from "sanity";
import { Info } from "lucide-react";
import { toPlainText } from "@portabletext/react";

export default defineType({
  name: "split-info",
  type: "object",
  icon: Info,
  title: "Split Info",
  description:
    "Column with a title, content body, image and tags. Part of a split cards.",
  initialValue: {
    title: "Website Development",
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
            text: "Website modern yang cepat, SEO-friendly, dan dirancang untuk mendukung tujuan bisnis.",
          },
        ],
      },
    ],
    tags: ["Next.js", "SEO", "Responsive"],
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "image",
      group: "content",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "uiIcon",
      group: "content",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown beside the info title.",
    }),
    defineField({
      name: "title",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "body",
      group: "content",
      type: "block-content",
    }),
    defineField({
      name: "tags",
      group: "content",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "body",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "No Title",
        subtitle: toPlainText(subtitle) || "No Subtitle",
      };
    },
  },
});
