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
  ],
  preview: {
    prepare() {
      return {
        title: "Theme Settings",
      };
    },
  },
});
