import { defineField, defineType } from "sanity";
import { COLOR_VARIANTS } from "./color-variant";

export const SECTION_DENSITY = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Compact", value: "compact" },
  { title: "Normal", value: "normal" },
  { title: "Spacious", value: "spacious" },
];

export const SECTION_MAX_WIDTH = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Full", value: "full" },
  { title: "Default", value: "default" },
  { title: "Narrow", value: "narrow" },
  { title: "Prose", value: "prose" },
];

export const SECTION_RADIUS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Small", value: "sm" },
  { title: "Medium", value: "md" },
  { title: "Large", value: "lg" },
];

export const SECTION_BG = [
  { title: "Inherit (Global)", value: "inherit" },
  ...COLOR_VARIANTS,
];

export const SECTION_ALIGN = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Left", value: "left" },
  { title: "Center", value: "center" },
];

export default defineType({
  name: "section-style",
  type: "object",
  title: "Section Style",
  description:
    "Per-section theming. Fields set to 'Inherit' fall back to the global Theme Settings.",
  fields: [
    defineField({
      name: "bg",
      title: "Background",
      type: "string",
      options: {
        list: SECTION_BG.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "density",
      title: "Vertical Density",
      type: "string",
      description: "Controls top & bottom padding.",
      options: {
        list: SECTION_DENSITY.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "maxWidth",
      title: "Max Width",
      type: "string",
      options: {
        list: SECTION_MAX_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "radius",
      title: "Corner Radius",
      type: "string",
      options: {
        list: SECTION_RADIUS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "align",
      title: "Content Alignment",
      type: "string",
      options: {
        list: SECTION_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
  ],
  preview: {
    select: {
      bg: "bg",
      density: "density",
      maxWidth: "maxWidth",
    },
    prepare({ bg, density, maxWidth }) {
      const parts = [
        bg && bg !== "inherit" ? `bg:${bg}` : null,
        density && density !== "inherit" ? `pad:${density}` : null,
        maxWidth && maxWidth !== "inherit" ? `w:${maxWidth}` : null,
      ].filter(Boolean);
      return {
        title: "Section Style",
        subtitle: parts.length ? parts.join(" · ") : "All inherit (global)",
      };
    },
  },
});
