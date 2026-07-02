import { defineField, defineType } from "sanity";
import { Megaphone } from "lucide-react";

export default defineType({
  name: "banner-section",
  title: "Banner Section",
  type: "object",
  icon: Megaphone,
  description: "A section for announcements, banners, or top headers with left text and right CTA",
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "primary",
    bgType: "color",
    size: "default",
    align: "left-right",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "bgType",
      group: "content",
      type: "string",
      title: "Background Type",
      options: {
        list: [
          { title: "Color Variant (Default)", value: "color" },
          { title: "Background Image", value: "image" },
        ],
        layout: "radio",
      },
      initialValue: "color",
    }),
    defineField({
      name: "bgImage",
      group: "content",
      type: "image",
      title: "Background Image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.bgType !== "image",
    }),
    defineField({
      name: "size",
      group: "content",
      type: "string",
      title: "Banner Height Size",
      options: {
        list: [
          { title: "Default height", value: "default" },
          { title: "Slim height (Info bar / top header)", value: "slim" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "align",
      group: "style",
      type: "string",
      title: "Content Alignment",
      options: {
        list: [
          { title: "Left text, Right CTA", value: "left-right" },
          { title: "Center content inline", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "left-right",
    }),
    defineField({
      name: "title",
      group: "content",
      type: "string",
      title: "Title Text",
      validation: (Rule) => Rule.required().error("Title Text is required"),
    }),
    defineField({
      name: "subtitle",
      group: "content",
      type: "text",
      title: "Subtitle / Description Text",
      rows: 2,
    }),
    defineField({
      name: "link",
      group: "content",
      type: "link",
      title: "CTA Link / Action",
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
      size: "size",
      colorVariant: "colorVariant",
    },
    prepare({ title, size, colorVariant }) {
      return {
        title: `Banner Section (${size || "default"})`,
        subtitle: `${title || ""} [Color: ${colorVariant || "none"}]`,
      };
    },
  },
});
