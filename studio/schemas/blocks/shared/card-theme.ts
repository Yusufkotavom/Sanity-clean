import { defineField, defineType } from "sanity";

export const CARD_SURFACE = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Neutral", value: "neutral" },
  { title: "Amber", value: "amber" },
  { title: "Sky", value: "sky" },
  { title: "Emerald", value: "emerald" },
  { title: "Rose", value: "rose" },
];

export const CARD_VARIANT = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Glass", value: "glass" },
  { title: "Solid", value: "solid" },
  { title: "Outline", value: "outline" },
  { title: "Muted", value: "muted" },
  { title: "Gradient", value: "gradient" },
];

export const CARD_RADIUS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Small", value: "sm" },
  { title: "Medium", value: "md" },
  { title: "Large", value: "lg" },
  { title: "X-Large", value: "xl" },
];

export const CARD_SHADOW = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Small", value: "sm" },
  { title: "Medium", value: "md" },
  { title: "Large", value: "lg" },
];

export const CARD_PADDING = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Compact", value: "compact" },
  { title: "Normal", value: "normal" },
  { title: "Spacious", value: "spacious" },
];

export default defineType({
  name: "card-theme",
  type: "object",
  title: "Card Theme",
  description:
    "Per-card theming. Fields set to 'Inherit' fall back to the global Theme Settings.",
  fields: [
    defineField({
      name: "surface",
      title: "Surface Tone",
      type: "string",
      description: "Glow/accent tint of the card.",
      options: {
        list: CARD_SURFACE.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "variant",
      title: "Surface Variant",
      type: "string",
      options: {
        list: CARD_VARIANT.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "radius",
      title: "Corner Radius",
      type: "string",
      options: {
        list: CARD_RADIUS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "shadow",
      title: "Shadow Depth",
      type: "string",
      options: {
        list: CARD_SHADOW.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
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
      surface: "surface",
      variant: "variant",
    },
    prepare({ surface, variant }) {
      const parts = [
        surface && surface !== "inherit" ? `tone:${surface}` : null,
        variant && variant !== "inherit" ? `variant:${variant}` : null,
      ].filter(Boolean);
      return {
        title: "Card Theme",
        subtitle: parts.length ? parts.join(" · ") : "All inherit (global)",
      };
    },
  },
});
