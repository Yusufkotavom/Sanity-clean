import { defineField, defineType } from "sanity";
import { GalleryHorizontal } from "lucide-react";

export default defineType({
  name: "carousel-1",
  type: "object",
  title: "Carousel 1",
  icon: GalleryHorizontal,
  description: "A carousel of images",
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    size: "one",
    indicators: "none",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "size",
      group: "content",
      type: "string",
      title: "Size",
      options: {
        list: [
          { title: "One", value: "one" },
          { title: "Two", value: "two" },
          { title: "Three", value: "three" },
        ],
        layout: "radio",
      },
      initialValue: "one",
    }),
    defineField({
      name: "indicators",
      group: "content",
      type: "string",
      title: "Slide Indicators",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Dots", value: "dots" },
          { title: "Count", value: "count" },
        ],
        layout: "radio",
      },
      initialValue: "none",
      description: "Choose how to indicate carousel progress and position",
    }),
    defineField({
      name: "aspectRatio",
      group: "content",
      type: "string",
      title: "Image Aspect Ratio",
      options: {
        list: [
          { title: "1:1 (Square)", value: "1/1" },
          { title: "4:3", value: "4/3" },
          { title: "16:9 (Widescreen)", value: "16/9" },
          { title: "3:2", value: "3/2" },
          { title: "Auto (Original)", value: "auto" },
        ],
        layout: "radio",
      },
      initialValue: "auto",
    }),
    defineField({
      name: "contentType",
      group: "content",
      type: "string",
      title: "Content Type",
      options: {
        list: [
          { title: "Images", value: "images" },
          { title: "Grid Cards", value: "grid" },
        ],
        layout: "radio",
      },
      initialValue: "images",
      description: "Choose whether this carousel displays images or grid cards",
    }),
    defineField({
      name: "images",
      group: "content",
      type: "array",
      of: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
            {
              name: "title",
              type: "string",
              title: "Title / Caption",
            },
            {
              name: "description",
              type: "text",
              title: "Description Text",
              rows: 2,
            },
            {
              name: "link",
              type: "link",
              title: "Link / Action",
              description: "Optional action when clicking this slide",
            },
          ],
        }),
      ],
      hidden: ({ parent }) => parent?.contentType === "grid",
    }),
    defineField({
      name: "cardTheme",
      group: "style",
      type: "card-theme",
      title: "Card Theme",
      description: "Visual theming applied to every card in this carousel.",
      hidden: ({ parent }) => parent?.contentType !== "grid",
    }),
    defineField({
      name: "cardStyle",
      group: "style",
      type: "string",
      title: "Card Style",
      description: "Visual style and layout for all cards in this carousel",
      options: {
        list: [
          { title: "Vertical (Icon Top, Text Below)", value: "vertical" },
          { title: "Horizontal (Icon Left, Text Right)", value: "horizontal" },
          { title: "Classic (Image Top, Text Below)", value: "classic" },
        ],
        layout: "radio",
      },
      initialValue: "vertical",
      hidden: ({ parent }) => parent?.contentType !== "grid",
    }),
    defineField({
      name: "textAlign",
      group: "style",
      type: "string",
      title: "Text Align",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "left",
      hidden: ({ parent }) => parent?.contentType !== "grid",
    }),
    defineField({
      name: "columns",
      group: "style",
      type: "array",
      title: "Grid Cards",
      description: "Add grid cards, blog posts, or pricing cards to display in the carousel",
      of: [
        { type: "grid-card" },
        { type: "grid-post" },
        { type: "pricing-card" },
      ],
      hidden: ({ parent }) => parent?.contentType !== "grid",
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
      title: "images.0.alt",
    },
    prepare({ title }) {
      return {
        title: "Carousel",
        subtitle: title,
      };
    },
  },
});
