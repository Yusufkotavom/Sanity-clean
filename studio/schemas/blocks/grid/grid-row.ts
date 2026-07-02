import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";
import { COLS_VARIANTS } from "../shared/layout-variants";

export default defineType({
  name: "grid-row",
  title: "Grid Row",
  type: "object",
  icon: LayoutGrid,
  initialValue: {
    sectionStyle: {
      _type: "section-style",
      bg: "inherit",
      density: "inherit",
      maxWidth: "inherit",
      radius: "inherit",
      align: "inherit",
    },
    cardTheme: {
      _type: "card-theme",
      surface: "inherit",
      variant: "inherit",
      radius: "inherit",
      shadow: "inherit",
      padding: "inherit",
    },
    gridColumns: "grid-cols-3",
    columns: [
      {
        _key: "column-1",
        _type: "grid-card",
        title: "IT Support",
        excerpt:
          "Dukungan teknis untuk maintenance, troubleshooting, dan stabilitas sistem operasional harian.",
        link: {
          _type: "link",
          isExternal: true,
          title: "Lihat Layanan",
          href: "/services/it-support",
          buttonVariant: "link",
        },
      },
      {
        _key: "column-2",
        _type: "grid-card",
        title: "Software Development",
        excerpt:
          "Pengembangan aplikasi custom untuk kebutuhan operasional, otomasi, dan dashboard bisnis.",
        link: {
          _type: "link",
          isExternal: true,
          title: "Lihat Layanan",
          href: "/services/software-development",
          buttonVariant: "link",
        },
      },
      {
        _key: "column-3",
        _type: "grid-card",
        title: "Printing Services",
        excerpt:
          "Layanan cetak materi bisnis dan promosi dengan kualitas tajam serta warna akurat.",
        link: {
          _type: "link",
          isExternal: true,
          title: "Lihat Layanan",
          href: "/services/printing-services",
          buttonVariant: "link",
        },
      },
    ],
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "cardTheme",
      group: "style",
      type: "card-theme",
      title: "Card Theme",
      description: "Visual theming applied to every card in this row.",
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
    }),
    defineField({
      name: "cardStyle",
      group: "style",
      type: "string",
      title: "Card Style",
      description: "Visual style and layout for all cards in this row",
      options: {
        list: [
          { title: "Vertical (Icon Top, Text Below)", value: "vertical" },
          { title: "Horizontal (Icon Left, Text Right)", value: "horizontal" },
          { title: "Classic (Image Top, Text Below)", value: "classic" },
        ],
        layout: "radio",
      },
      initialValue: "vertical",
    }),
    defineField({
      name: "gridColumns",
      group: "content",
      type: "string",
      title: "Grid Columns",
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "grid-cols-3",
    }),
    // add only the blocks you need
    defineField({
      name: "columns",
      group: "style",
      type: "array",
      of: [
        { type: "grid-card" },
        { type: "grid-post" },
        { type: "pricing-card" },
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
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
      title: "columns.0.title",
      postTitle: "columns.0.post.title",
    },
    prepare({ title, postTitle }) {
      return {
        title: "Grid Row",
        subtitle: title || postTitle,
      };
    },
  },
});
