import { defineField, defineType } from "sanity";
import { Sparkles } from "lucide-react";

export default defineType({
  name: "hero-vercel",
  title: "Hero Vercel Style",
  type: "object",
  icon: Sparkles,
  initialValue: {
    tagLine: "The native Next.js platform",
    title: "Build, scale, and secure faster with framework-aware infrastructure",
    description:
      "Replicate Vercel-style product hero with clear value proposition, clean CTA stack, and supporting icon cards.",
    ctaPrimary: {
      _type: "link",
      isExternal: false,
      title: "Start Deploying",
      target: false,
    },
    ctaSecondary: {
      _type: "link",
      isExternal: false,
      title: "Get a Demo",
      target: false,
    },
    cards: [
      {
        _key: "card-cache",
        _type: "hero-feature-card",
        title: "Cache, controlled",
        description: "Define per-component revalidation and keep content fast globally.",
      },
      {
        _key: "card-build",
        _type: "hero-feature-card",
        title: "Fast builds",
        description: "Ship quickly with optimized build pipeline and deployment flow.",
      },
      {
        _key: "card-downtime",
        _type: "hero-feature-card",
        title: "Zero downtime",
        description: "Framework-aware infra protects against cache/version skew issues.",
      },
    ],
  },
  groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
        defineField({
          name: "tagLine",
          title: "Eyebrow",
          type: "string",
          group: "content",
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          group: "content",
          validation: (Rule) => Rule.required().min(8).max(180),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          group: "content",
          rows: 4,
          validation: (Rule) => Rule.max(320),
        }),
        defineField({
          name: "ctaPrimary",
          title: "Primary CTA",
          type: "link",
          group: "content",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ctaSecondary",
          title: "Secondary CTA",
          type: "link",
          group: "content",
        }),
        defineField({
          name: "cards",
          title: "Feature Cards",
          type: "array",
          group: "content",
          of: [{ type: "hero-feature-card" }],
          validation: (Rule) => Rule.min(1).max(4),
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "image",
          group: "content",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        }),
        defineField({
          name: "useCard",
          type: "boolean",
          title: "Card Style",
          description: "Display content inside a rounded card",
          group: "style",
          initialValue: true,
        }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            group: "style",
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Hero Vercel Style",
        subtitle: subtitle || "No eyebrow",
      };
    },
  },
});
