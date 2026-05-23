import { Image as ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "ogSettings",
  title: "OG Settings",
  type: "document",
  icon: ImageIcon,
  fieldsets: [
    { name: "branding", title: "Branding", options: { columns: 2 } },
    { name: "content", title: "Content Options", options: { columns: 2 } },
    { name: "images", title: "Images" },
  ],
  initialValue: {
    brandName: "kotacom",
    ctaText: "WA 085799520350 · kotacom.id",
    showDescription: true,
    showCta: true,
  },
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      description: "Displayed next to logo in OG image.",
      fieldset: "branding",
    }),
    defineField({
      name: "logoUrl",
      title: "Logo URL",
      type: "url",
      description: "Direct URL to logo image (square, PNG/SVG). Falls back to site settings logo.",
      fieldset: "branding",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "string",
      description: "Text in the black bar at bottom-left. E.g. 'WA 085799520350 · kotacom.id'",
      fieldset: "branding",
    }),
    defineField({
      name: "showDescription",
      title: "Show Description",
      type: "boolean",
      initialValue: true,
      fieldset: "content",
    }),
    defineField({
      name: "showCta",
      title: "Show CTA Bar",
      type: "boolean",
      initialValue: true,
      fieldset: "content",
    }),
    defineField({
      name: "fallbackImage",
      title: "Fallback Image URL",
      type: "url",
      description: "Default right-side image when page has no specific image.",
      fieldset: "images",
    }),
    defineField({
      name: "images",
      title: "Image Library",
      type: "array",
      description: "Upload multiple images. OG generator can pick from these based on page category or randomly.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt / Label" },
            { name: "category", type: "string", title: "Category", description: "E.g. 'website', 'percetakan', 'software'" },
          ],
        },
      ],
      fieldset: "images",
    }),
  ],
  preview: {
    prepare() {
      return { title: "OG Settings" };
    },
  },
});
