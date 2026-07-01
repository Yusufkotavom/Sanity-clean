import { defineField, defineType } from "sanity";
import { Palette } from "lucide-react";

const GRADIENT_DIRECTIONS = [
  { title: "→ Right", value: "to right" },
  { title: "← Left", value: "to left" },
  { title: "↓ Bottom", value: "to bottom" },
  { title: "↘ Bottom Right", value: "to bottom right" },
  { title: "↑ Top", value: "to top" },
  { title: "◎ Radial", value: "radial-gradient(circle" },
];

const COLOR_FIELDS = [
  defineField({ name: "lightPrimary", title: "Primary", type: "color" }),
  defineField({ name: "lightPrimaryForeground", title: "Primary FG", type: "color" }),
  defineField({ name: "lightAccent", title: "Accent", type: "color" }),
  defineField({ name: "lightRing", title: "Ring", type: "color" }),
];

const DARK_COLOR_FIELDS = [
  defineField({ name: "darkPrimary", title: "Primary", type: "color" }),
  defineField({ name: "darkPrimaryForeground", title: "Primary FG", type: "color" }),
  defineField({ name: "darkAccent", title: "Accent", type: "color" }),
  defineField({ name: "darkRing", title: "Ring", type: "color" }),
];

function gradientFields(title: string) {
  return defineField({
    name: title === "Light Gradient" ? "lightGradient" : "darkGradient",
    title,
    type: "object",
    fields: [
      defineField({ name: "enabled", type: "boolean", initialValue: false }),
      defineField({ name: "direction", type: "string", options: { list: GRADIENT_DIRECTIONS }, initialValue: "to right" }),
      defineField({ name: "from", type: "color", title: "From" }),
      defineField({ name: "via", type: "color", title: "Via" }),
      defineField({ name: "to", type: "color", title: "To" }),
    ],
  });
}

export default defineType({
  name: "themeSettings",
  title: "Theme Settings",
  type: "document",
  icon: Palette,
  fields: [
    (defineField as any)({
      name: "tabs",
      type: "object",
      groups: [
        { name: "colors", title: "Warna" },
        { name: "cards", title: "Kartu Grid" },
        { name: "blocks", title: "Block" },
        { name: "buttons", title: "Tombol" },
      ],
      fields: [
        // ── TAB: WARNA ──
        defineField({
          name: "themeColors",
          title: "Warna",
          type: "object",
          group: "colors",
          fields: [
            defineField({
              name: "themePreset",
              title: "Preset",
              type: "string",
              initialValue: "neutral",
              options: {
                list: [
                  { title: "Neutral", value: "neutral" },
                  { title: "Ocean", value: "ocean" },
                  { title: "Sunset", value: "sunset" },
                  { title: "Brand A (Blue)", value: "brand-tricolor-a" },
                  { title: "Brand B (Red)", value: "brand-tricolor-b" },
                  { title: "Brand C (Yellow)", value: "brand-tricolor-c" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({
              name: "lightColors",
              title: "Light Mode",
              type: "object",
              fields: COLOR_FIELDS,
            }),
            defineField({
              name: "darkColors",
              title: "Dark Mode",
              type: "object",
              fields: DARK_COLOR_FIELDS,
            }),
            gradientFields("Light Gradient"),
            gradientFields("Dark Gradient"),
          ],
        }),

        // ── TAB: KARTU GRID ──
        defineField({
          name: "themeTokens",
          title: "Kartu Grid",
          type: "object",
          group: "cards",
          fields: [
            defineField({
              name: "defaultCardVariant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Glass", value: "glass" },
                  { title: "Solid", value: "solid" },
                  { title: "Outline", value: "outline" },
                  { title: "Muted", value: "muted" },
                  { title: "Gradient", value: "gradient" },
                ],
                layout: "radio",
              },
              initialValue: "glass",
            }),
            defineField({
              name: "radiusScale",
              title: "Radius",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Sm", value: "sm" },
                  { title: "Md", value: "md" },
                  { title: "Lg", value: "lg" },
                  { title: "Xl", value: "xl" },
                ],
                layout: "radio",
              },
              initialValue: "lg",
            }),
            defineField({
              name: "shadowDepth",
              title: "Shadow",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Sm", value: "sm" },
                  { title: "Md", value: "md" },
                  { title: "Lg", value: "lg" },
                ],
                layout: "radio",
              },
              initialValue: "md",
            }),
            defineField({
              name: "cardPadding",
              title: "Padding",
              type: "string",
              options: {
                list: [
                  { title: "Compact", value: "compact" },
                  { title: "Normal", value: "normal" },
                  { title: "Spacious", value: "spacious" },
                ],
                layout: "radio",
              },
              initialValue: "normal",
            }),
            defineField({
              name: "accentTone",
              title: "Surface Tone",
              type: "string",
              options: {
                list: [
                  { title: "Neutral", value: "neutral" },
                  { title: "Amber", value: "amber" },
                  { title: "Sky", value: "sky" },
                  { title: "Emerald", value: "emerald" },
                  { title: "Rose", value: "rose" },
                ],
                layout: "radio",
              },
              initialValue: "neutral",
            }),
            defineField({
              name: "cardColors",
              title: "Custom Card Colors",
              type: "object",
              description: "Override card background, text, and border colors globally",
              fields: [
                defineField({ name: "cardBg", title: "Card Background", type: "color" }),
                defineField({ name: "cardFg", title: "Card Text", type: "color" }),
                defineField({ name: "cardBorder", title: "Card Border", type: "color" }),
              ],
            }),
          ],
        }),

        // ── TAB: BLOCK ──
        defineField({
          name: "themeBlocks",
          title: "Block Background",
          type: "object",
          group: "blocks",
          fields: [
            defineField({
              name: "defaultDensity",
              title: "Section Density",
              type: "string",
              options: {
                list: [
                  { title: "Compact", value: "compact" },
                  { title: "Normal", value: "normal" },
                  { title: "Spacious", value: "spacious" },
                ],
                layout: "radio",
              },
              initialValue: "normal",
            }),
            defineField({
              name: "defaultSectionWidth",
              title: "Section Width",
              type: "string",
              description: "Default width for all sections: compact (contained) or full (edge-to-edge)",
              options: {
                list: [
                  { title: "Compact", value: "compact" },
                  { title: "Full Wide", value: "full" },
                ],
                layout: "radio",
              },
              initialValue: "compact",
            }),
            defineField({
              name: "defaultSectionRadius",
              title: "Section Radius",
              type: "string",
              description: "Border radius for section backgrounds",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Sm", value: "sm" },
                  { title: "Md", value: "md" },
                  { title: "Lg", value: "lg" },
                ],
                layout: "radio",
              },
              initialValue: "none",
            }),
            defineField({
              name: "defaultDivider",
              title: "Section Divider",
              type: "string",
              description: "Horizontal line between sections",
              options: {
                list: [
                  { title: "Show", value: "show" },
                  { title: "Hide", value: "hide" },
                ],
                layout: "radio",
              },
              initialValue: "show",
            }),
            defineField({
              name: "sectionColors",
              title: "Section Colors",
              type: "object",
              description: "Custom background and text colors for sections",
              fields: [
                defineField({ name: "sectionBg", title: "Section Background", type: "color" }),
                defineField({ name: "sectionFg", title: "Section Text", type: "color" }),
                defineField({ name: "sectionBorder", title: "Section Border", type: "color" }),
              ],
            }),
            defineField({
              name: "panelColors",
              title: "Panel (SectionPanel) Colors",
              type: "object",
              description: "Custom glassmorphism panel colors",
              fields: [
                defineField({ name: "panelBg", title: "Panel Background", type: "color" }),
                defineField({ name: "panelBorder", title: "Panel Border", type: "color" }),
              ],
            }),
          ],
        }),

        // ── TAB: TOMBOL ──
        defineField({
          name: "themeButtons",
          title: "Tombol",
          type: "object",
          group: "buttons",
          fields: [
            defineField({
              name: "defaultVariant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Default", value: "default" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Outline", value: "outline" },
                  { title: "Ghost", value: "ghost" },
                  { title: "Destructive", value: "destructive" },
                  { title: "Link", value: "link" },
                ],
                layout: "radio",
              },
              initialValue: "default",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Sm", value: "sm" },
                  { title: "Default", value: "default" },
                  { title: "Lg", value: "lg" },
                ],
                layout: "radio",
              },
              initialValue: "default",
            }),
            defineField({
              name: "radius",
              title: "Radius",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Sm", value: "sm" },
                  { title: "Md", value: "md" },
                  { title: "Lg", value: "lg" },
                  { title: "Pill", value: "pill" },
                ],
                layout: "radio",
              },
              initialValue: "md",
            }),
            defineField({
              name: "shadow",
              title: "Shadow",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Sm", value: "sm" },
                  { title: "Md", value: "md" },
                  { title: "Lg", value: "lg" },
                ],
                layout: "radio",
              },
              initialValue: "md",
            }),
            defineField({
              name: "border",
              title: "Border",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Subtle", value: "subtle" },
                  { title: "Strong", value: "strong" },
                ],
                layout: "radio",
              },
              initialValue: "subtle",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Arrow", value: "arrow-right" },
                  { title: "Chevron", value: "chevron-right" },
                  { title: "External", value: "external-link" },
                  { title: "Phone", value: "phone" },
                  { title: "Mail", value: "mail" },
                ],
                layout: "radio",
              },
              initialValue: "none",
            }),
            defineField({
              name: "iconPosition",
              title: "Icon Position",
              type: "string",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Right", value: "right" },
                ],
                layout: "radio",
              },
              initialValue: "right",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Theme Settings" };
    },
  },
});
