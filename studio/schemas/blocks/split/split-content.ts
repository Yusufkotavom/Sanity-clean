import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";

export default defineType({
  name: "split-content",
  type: "object",
  icon: TextQuote,
  title: "Split Content",
  description: "Column with tag line, title and content body.",
  initialValue: {
    sticky: false,
    colorVariant: "background",
    tagLine: "Mengapa Kami Ada",
    title: "One-stop partner untuk kebutuhan teknis bisnis modern",
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
            text: "Kami membantu bisnis tetap fokus ke growth dengan menangani website, software, IT support, dan kebutuhan digital secara terintegrasi.",
          },
        ],
      },
    ],
    link: {
      _type: "link",
      isExternal: false,
      title: "Diskusikan Kebutuhan",
      target: false,
      buttonVariant: "default",
    },
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "sticky",
      group: "content",
      type: "boolean",
      description: "Sticky column on desktop",
      initialValue: false,
    }),
    defineField({
      name: "tagLine",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "image",
      group: "content",
      title: "Image",
      type: "image",
      description: "Optional image displayed above the content.",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt Text" },
      ],
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
      name: "link",
      group: "content",
      type: "link",
      description:
        "Link to a page or external URL. Leave empty to hide the link.",
    }),
      defineField({
            name: "blockStyles",
      group: "style",
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
        title: title || "No Title",
      };
    },
  },
});
