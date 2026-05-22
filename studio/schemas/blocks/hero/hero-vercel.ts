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
  fields: [
    defineField({
      name: "tagLine",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(8).max(180),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "link",
    }),
    defineField({
      name: "cards",
      title: "Feature Cards",
      type: "array",
      of: [{ type: "hero-feature-card" }],
      validation: (Rule) => Rule.min(1).max(4),
      description: "Recommended 3 cards to match Vercel-style hero rhythm.",
    }),
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
