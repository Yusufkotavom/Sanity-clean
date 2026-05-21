import { Image as ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "ogSettings",
  title: "OG Settings",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      initialValue: "KotaCom",
    }),
    defineField({
      name: "defaultBadge",
      title: "Default Badge",
      type: "string",
      initialValue: "Insights",
    }),
    defineField({
      name: "gradientFrom",
      title: "Gradient From",
      type: "string",
      initialValue: "#0B1220",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
          invert: false,
        }).warning("Use hex color format, e.g. #0B1220"),
    }),
    defineField({
      name: "gradientTo",
      title: "Gradient To",
      type: "string",
      initialValue: "#1E293B",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
          invert: false,
        }).warning("Use hex color format, e.g. #1E293B"),
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      type: "string",
      initialValue: "#22D3EE",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
          invert: false,
        }).warning("Use hex color format, e.g. #22D3EE"),
    }),
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "string",
      initialValue: "#FFFFFF",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
          invert: false,
        }).warning("Use hex color format, e.g. #FFFFFF"),
    }),
    defineField({
      name: "fontFamily",
      title: "Font Family Name",
      type: "string",
      description: "Used as CSS font-family label for OG canvas.",
      initialValue: "Inter",
    }),
    defineField({
      name: "fontUrl",
      title: "Font URL (TTF/OTF/WOFF)",
      type: "url",
      description: "Optional remote font URL for custom typography.",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "titleMaxLength",
      title: "Title Max Length",
      type: "number",
      initialValue: 140,
      validation: (Rule) => Rule.min(40).max(220),
    }),
    defineField({
      name: "titleFontSize",
      title: "Title Font Size",
      type: "number",
      initialValue: 82,
      validation: (Rule) => Rule.min(32).max(120),
    }),
    defineField({
      name: "titleLineHeight",
      title: "Title Line Height",
      type: "number",
      initialValue: 1.08,
      validation: (Rule) => Rule.min(0.9).max(1.6),
    }),
    defineField({
      name: "titleLetterSpacingEm",
      title: "Title Letter Spacing (em)",
      type: "number",
      initialValue: -0.03,
      validation: (Rule) => Rule.min(-0.2).max(0.2),
    }),
    defineField({
      name: "titleClampLines",
      title: "Title Clamp Lines",
      type: "number",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "canvasPaddingX",
      title: "Canvas Padding X",
      type: "number",
      initialValue: 76,
      validation: (Rule) => Rule.min(24).max(180),
    }),
    defineField({
      name: "canvasPaddingY",
      title: "Canvas Padding Y",
      type: "number",
      initialValue: 68,
      validation: (Rule) => Rule.min(24).max(180),
    }),
    defineField({
      name: "headerDotSize",
      title: "Header Dot Size",
      type: "number",
      initialValue: 10,
      validation: (Rule) => Rule.min(4).max(24),
    }),
    defineField({
      name: "badgeBorderWidth",
      title: "Badge Border Width",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(8),
    }),
    defineField({
      name: "badgeBorderRadius",
      title: "Badge Border Radius",
      type: "number",
      initialValue: 999,
      validation: (Rule) => Rule.min(0).max(999),
    }),
    defineField({
      name: "footerBorderColor",
      title: "Footer Border Color",
      type: "string",
      initialValue: "#FFFFFF",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
          invert: false,
        }).warning("Use hex color format, e.g. #FFFFFF"),
    }),
    defineField({
      name: "footerBorderOpacity",
      title: "Footer Border Opacity",
      type: "number",
      initialValue: 0.18,
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: "overlayEnabled",
      title: "Enable Accent Overlay",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "overlayOpacity",
      title: "Overlay Opacity",
      type: "number",
      initialValue: 0.12,
      validation: (Rule) => Rule.min(0).max(1),
    }),
  ],
  preview: {
    select: {
      title: "eyebrow",
    },
    prepare({ title }) {
      return {
        title: title || "OG Settings",
        subtitle: "Global Open Graph image visual configuration",
      };
    },
  },
});
