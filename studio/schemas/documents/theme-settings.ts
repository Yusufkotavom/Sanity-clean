import { defineField, defineType } from "sanity";
import { Palette } from "lucide-react";
import ColorOptionInput from "../inputs/color-option-input";
import ThemeColorsInput from "../inputs/theme-colors-input";
const GEIST_COLOR_OPTIONS = [
  { title: "Default (Follow Code)", value: "" },
  { title: "Gray 10", value: "#171717" },
  { title: "Gray 9", value: "#404040" },
  { title: "Gray 8", value: "#525252" },
  { title: "Gray 3", value: "#EBEBEB" },
  { title: "Gray 2", value: "#F5F5F5" },
  { title: "Gray 1", value: "#FAFAFA" },
  { title: "Blue 6", value: "#0070F3" },
  { title: "Blue 5", value: "#3291FF" },
  { title: "Green 6", value: "#00A86B" },
  { title: "Teal 6", value: "#14B8A6" },
  { title: "Amber 6", value: "#F59E0B" },
  { title: "Purple 6", value: "#8B5CF6" },
  { title: "Red 6", value: "#E5484D" },
  { title: "Rose 6", value: "#FB7185" },
];

const GEIST_FOREGROUND_OPTIONS = [
  { title: "Default (Follow Code)", value: "" },
  { title: "Gray 1", value: "#FAFAFA" },
  { title: "Gray 2", value: "#F5F5F5" },
  { title: "Gray 3", value: "#EBEBEB" },
  { title: "Gray 9", value: "#404040" },
  { title: "Gray 10", value: "#171717" },
  { title: "Dark Background Soft", value: "#0A0A0A" },
  { title: "Dark Background Strong", value: "#111111" },
];

export default defineType({
  name: "themeSettings",
  title: "Theme Settings",
  type: "document",
  icon: Palette,
  fields: [
    defineField({
      name: "themeColors",
      title: "Theme Colors",
      type: "object",
      description:
        "Dedicated document for website theme colors. Studio shows guides, swatches, preset previews, and recommended combinations so editors can choose colors without reading raw HEX first.",
      components: { input: ThemeColorsInput },
      fields: [
        defineField({
          name: "themePreset",
          title: "Theme Preset",
          type: "string",
          description:
            "Preset applies an automatic palette on frontend. Individual color fields below can override it.",
          initialValue: "neutral",
          options: {
            list: [
              { title: "Neutral (Geist Default)", value: "neutral" },
              { title: "Ocean (Blue Focus)", value: "ocean" },
              { title: "Sunset (Warm Accent)", value: "sunset" },
              { title: "Brand Tricolor A (Blue Primary, Red Accent, Yellow Ring)", value: "brand-tricolor-a" },
              { title: "Brand Tricolor B (Red Primary, Blue Accent, Yellow Ring)", value: "brand-tricolor-b" },
              { title: "Brand Tricolor C (Yellow Primary, Blue Accent, Red Ring)", value: "brand-tricolor-c" },
            ],
            layout: "dropdown",
          },
        }),
        defineField({
          name: "lightPrimary",
          title: "Light: Primary",
          type: "string",
          description: "Main brand/action color in light mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "lightPrimaryForeground",
          title: "Light: Primary Foreground",
          type: "string",
          description: "Text/icon color on top of Light Primary.",
          initialValue: "",
          options: { list: GEIST_FOREGROUND_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "lightAccent",
          title: "Light: Accent",
          type: "string",
          description: "Subtle accent/surface tint in light mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "lightRing",
          title: "Light: Ring",
          type: "string",
          description: "Focus ring color in light mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "darkPrimary",
          title: "Dark: Primary",
          type: "string",
          description: "Main brand/action color in dark mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "darkPrimaryForeground",
          title: "Dark: Primary Foreground",
          type: "string",
          description: "Text/icon color on top of Dark Primary.",
          initialValue: "",
          options: { list: GEIST_FOREGROUND_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "darkAccent",
          title: "Dark: Accent",
          type: "string",
          description: "Subtle accent/surface tint in dark mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
        defineField({
          name: "darkRing",
          title: "Dark: Ring",
          type: "string",
          description: "Focus ring color in dark mode.",
          initialValue: "",
          options: { list: GEIST_COLOR_OPTIONS, layout: "dropdown" },
          components: { input: ColorOptionInput },
        }),
      ],
    }),
    defineField({
      name: "themeTokens",
      title: "Theme Tokens (Global Defaults)",
      type: "object",
      description:
        "Global defaults for radius, surfaces, shadows, and density. Per-block 'Inherit' fields fall back to these.",
      fields: [
        defineField({
          name: "radiusScale",
          title: "Default Corner Radius",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Small", value: "sm" },
              { title: "Medium", value: "md" },
              { title: "Large", value: "lg" },
              { title: "X-Large", value: "xl" },
            ],
            layout: "radio",
          },
          initialValue: "lg",
        }),
        defineField({
          name: "defaultCardVariant",
          title: "Default Card Variant",
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
          name: "accentTone",
          title: "Default Card Surface Tone",
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
          name: "shadowDepth",
          title: "Default Card Shadow",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Small", value: "sm" },
              { title: "Medium", value: "md" },
              { title: "Large", value: "lg" },
            ],
            layout: "radio",
          },
          initialValue: "md",
        }),
        defineField({
          name: "cardPadding",
          title: "Default Card Padding",
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
          name: "defaultDensity",
          title: "Default Section Density",
          type: "string",
          description: "Default vertical padding for all sections.",
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
      ],
    }),
    defineField({
      name: "themeButtons",
      title: "Theme Buttons (Global Defaults)",
      type: "object",
      description:
        "Global defaults for buttons across the site. Per-section 'Button Theme' overrides fall back to these.",
      fields: [
        defineField({
          name: "defaultVariant",
          title: "Default Variant",
          type: "string",
          description: "Variant used when a button does not specify one.",
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
          title: "Default Size",
          type: "string",
          options: {
            list: [
              { title: "Small", value: "sm" },
              { title: "Default", value: "default" },
              { title: "Large", value: "lg" },
            ],
            layout: "radio",
          },
          initialValue: "default",
        }),
        defineField({
          name: "radius",
          title: "Default Corner Radius",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Small", value: "sm" },
              { title: "Medium", value: "md" },
              { title: "Large", value: "lg" },
              { title: "Pill", value: "pill" },
            ],
            layout: "radio",
          },
          initialValue: "md",
        }),
        defineField({
          name: "shadow",
          title: "Default Shadow",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Small", value: "sm" },
              { title: "Medium", value: "md" },
              { title: "Large", value: "lg" },
            ],
            layout: "radio",
          },
          initialValue: "md",
        }),
        defineField({
          name: "border",
          title: "Default Border Style",
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
          title: "Default Icon",
          type: "string",
          description: "Auto-appended icon for text-only buttons.",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Arrow Right", value: "arrow-right" },
              { title: "Chevron Right", value: "chevron-right" },
              { title: "External Link", value: "external-link" },
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
  preview: {
    prepare() {
      return {
        title: "Theme Settings",
      };
    },
  },
});
