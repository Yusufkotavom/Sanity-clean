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
      name: "ogBaseUrl",
      title: "OG Base URL",
      type: "url",
      description:
        "Primary base URL for OG image generation endpoint. Example: https://sanity-nextjs-kotacom.vercel.app",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
      fieldset: "branding",
    }),
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
      description:
        "Default right-side image when no exact category match exists. Use HTTPS CDN/image URL. If Image Library has items, generator now prefers library fallback before this URL.",
      fieldset: "images",
    }),
    defineField({
      name: "images",
      title: "Image Library",
      type: "array",
      description:
        "Upload multiple right-side OG images. Fill every item with asset + alt + category. Recommended categories: website, software, percetakan, blog. Generator uses exact category match first, then library fallback, then fallbackImage.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt / Label",
              description: "Required. Short label for this OG image, e.g. Website development illustration.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "category",
              type: "string",
              title: "Category",
              description:
                "Required. Use one of: website, software, percetakan, blog. Matches badge/title detection in /api/og.",
              options: {
                list: [
                  { title: "Website", value: "website" },
                  { title: "Software", value: "software" },
                  { title: "Percetakan", value: "percetakan" },
                  { title: "Blog", value: "blog" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
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
