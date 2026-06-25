import { defineField, defineType } from "sanity";

export const BUTTON_VARIANT_OPTIONS = [
  { title: "Default", value: "default" },
  { title: "Secondary", value: "secondary" },
  { title: "Outline", value: "outline" },
  { title: "Ghost", value: "ghost" },
  { title: "Destructive", value: "destructive" },
  { title: "Link", value: "link" },
];

export const BUTTON_RADIUS_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Small", value: "sm" },
  { title: "Medium", value: "md" },
  { title: "Large", value: "lg" },
  { title: "Pill", value: "pill" },
];

export const BUTTON_SIZE_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Small", value: "sm" },
  { title: "Default", value: "default" },
  { title: "Large", value: "lg" },
];

export const BUTTON_SHADOW_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Small", value: "sm" },
  { title: "Medium", value: "md" },
  { title: "Large", value: "lg" },
];

export const BUTTON_BORDER_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Subtle", value: "subtle" },
  { title: "Strong", value: "strong" },
];

export const BUTTON_ICON_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "None", value: "none" },
  { title: "Arrow Right", value: "arrow-right" },
  { title: "Chevron Right", value: "chevron-right" },
  { title: "External Link", value: "external-link" },
  { title: "Phone", value: "phone" },
  { title: "Mail", value: "mail" },
];

export const BUTTON_ICON_POSITION_OPTIONS = [
  { title: "Inherit (Global)", value: "inherit" },
  { title: "Left", value: "left" },
  { title: "Right", value: "right" },
];

export default defineType({
  name: "button-theme",
  type: "object",
  title: "Button Theme",
  description:
    "Per-section button theming. Fields set to 'Inherit' fall back to the global Theme Settings.",
  fields: [
    defineField({
      name: "variant",
      title: "Default Variant",
      type: "string",
      options: {
        list: [
          { title: "Inherit (Global)", value: "inherit" },
          ...BUTTON_VARIANT_OPTIONS,
        ],
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: BUTTON_SIZE_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "radius",
      title: "Corner Radius",
      type: "string",
      options: {
        list: BUTTON_RADIUS_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "shadow",
      title: "Shadow Depth",
      type: "string",
      options: {
        list: BUTTON_SHADOW_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "border",
      title: "Border Style",
      type: "string",
      options: {
        list: BUTTON_BORDER_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "icon",
      title: "Default Icon",
      type: "string",
      description: "Auto-appended icon for text-only buttons in this section.",
      options: {
        list: BUTTON_ICON_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
    defineField({
      name: "iconPosition",
      title: "Icon Position",
      type: "string",
      options: {
        list: BUTTON_ICON_POSITION_OPTIONS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "inherit",
    }),
  ],
  preview: {
    select: {
      variant: "variant",
      radius: "radius",
    },
    prepare({ variant, radius }) {
      const parts = [
        variant && variant !== "inherit" ? `variant:${variant}` : null,
        radius && radius !== "inherit" ? `radius:${radius}` : null,
      ].filter(Boolean);
      return {
        title: "Button Theme",
        subtitle: parts.length ? parts.join(" · ") : "All inherit (global)",
      };
    },
  },
});
