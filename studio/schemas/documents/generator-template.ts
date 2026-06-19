import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const validateUniqueTokenNames = (value: unknown) => {
  if (!Array.isArray(value)) {
    return true;
  }

  const seen = new Set<string>();
  for (const entry of value) {
    const name = typeof entry === "object" && entry !== null ? (entry as { name?: unknown }).name : undefined;
    if (typeof name !== "string" || name.length === 0) {
      continue;
    }

    if (seen.has(name)) {
      return "Token definition names must be unique.";
    }

    seen.add(name);
  }

  return true;
};

const TEMPLATE_BLOCK_TYPES = [
  "hero-1",
  "hero-2",
  "stats-hero-block",
  "section-header",
  "split-row",
  "grid-row",
  "carousel-1",
  "carousel-2",
  "timeline-row",
  "cta-1",
  "whatsapp-cta",
  "logo-cloud-1",
  "faqs",
  "form-newsletter",
  "all-posts",
  "legacy-rich-content",
  "company-info",
  "testimonials-block",
  "pricing-block",
  "faq-block",
  "features-package-block",
  "service-types-block",
  "problem-solution-block",
  "value-props-block",
  "eeat-block",
  "metrics-rail-block",
  "highlights-block",
  "reviews-block",
  "quote-spotlight-block",
  "micro-badges-block",
  "related-links-block",
  "process-faq-block",
  "block-preset-ref",
] as const;

export default defineType({
  name: "generatorTemplate",
  title: "Generator Template",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "generatorTemplate" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "outputType",
      title: "Output Type",
      type: "string",
      options: {
        list: [{ title: "Page", value: "page" }],
        layout: "radio",
      },
      initialValue: "page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "routeBase",
      title: "Route Base",
      type: "string",
      description: "Base path for generated pages, e.g. /jasa-cetak-buku or /pembuatan-website",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== "string") return "Route base is required.";
          if (!/^\/[a-z0-9/-]*$/.test(value)) return "Must start with / and use lowercase path-safe characters.";
          if (value.includes("//")) return "Cannot contain double slashes.";
          if (value.length > 1 && value.endsWith("/")) return "Cannot end with trailing slash.";
          return true;
        }),
    }),
    defineField({
      name: "slugPattern",
      title: "Slug Pattern",
      type: "string",
      description: "Pattern for generated page slug. Tokens: {{routeBase}}, {{city}}, {{service}}, {{primaryKeyword}}.",
      initialValue: "{{routeBase}}-{{city}}",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== "string" || !value.includes("{{routeBase}}"))
            return "Slug pattern must include {{routeBase}}.";
          return true;
        }),
    }),

    defineField({
      name: "blockTokenReference",
      title: "Block Token Quick Copy",
      type: "text",
      rows: 8,
      readOnly: true,
      initialValue:
        "{{routeBase}}\n{{city}}\n{{service}}\n{{primaryKeyword}}\n{{title}}\n{{metaTitle}}\n{{metaDescription}}\n{{ctaLabel}}\n{{ctaHref}}",
      description:
        "Copy token dari sini lalu tempel ke field teks di Template Blocks. Token dataset lain juga tetap bisa dipakai dengan format {{namaKolom}}.",
    }),
    defineField({
      name: "blocks",
      title: "Template Blocks",
      type: "array",
      description: "Build the full page here using native Sanity blocks. Use {{token}} placeholders in string fields.",
      of: TEMPLATE_BLOCK_TYPES.map((blockType) => ({ type: blockType })),
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "seoMeta",
      title: "SEO Meta Pattern",
      type: "object",
      description: "Token-based SEO metadata. Supports {{token}} placeholders.",
      fields: [
        defineField({
          name: "titlePattern",
          title: "Meta Title Pattern",
          type: "string",
          description: "e.g. {{primaryKeyword}} | Kotacom",
          validation: (Rule) => Rule.required().max(70).warning("Keep under 70 chars after token replacement."),
        }),
        defineField({
          name: "descriptionPattern",
          title: "Meta Description Pattern",
          type: "text",
          rows: 3,
          description: "e.g. {{offer}}. {{localCondition}}. Hubungi kami sekarang.",
          validation: (Rule) => Rule.required().max(200).warning("Keep under 160 chars after token replacement."),
        }),
        defineField({
          name: "focusKeywordToken",
          title: "Focus Keyword Token",
          type: "string",
          description: "Token for focus keyword, e.g. {{primaryKeyword}}",
          initialValue: "{{primaryKeyword}}",
        }),
        defineField({
          name: "secondaryKeywordsSource",
          title: "Secondary Keywords Source",
          type: "string",
          description: "Dataset field name that contains the secondary keywords array.",
          initialValue: "secondaryKeywords",
        }),
      ],
    }),
    defineField({
      name: "aggregateRatingDefaults",
      title: "Aggregate Rating Defaults",
      type: "object",
      description: "Default rating applied to all generated pages from this template.",
      fields: [
        defineField({
          name: "ratingValue",
          title: "Rating Value",
          type: "number",
          validation: (Rule) => Rule.min(1).max(5).precision(1),
        }),
        defineField({
          name: "reviewCount",
          title: "Review Count",
          type: "number",
          validation: (Rule) => Rule.min(1).integer(),
        }),
        defineField({
          name: "bestRating",
          title: "Best Rating",
          type: "number",
          initialValue: 5,
        }),
        defineField({
          name: "ratingSource",
          title: "Rating Source",
          type: "string",
          options: {
            list: [
              { title: "Google Maps", value: "google-maps" },
              { title: "Internal Reviews", value: "internal" },
              { title: "Tokopedia", value: "tokopedia" },
              { title: "Calculated", value: "calculated" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Ready", value: "ready" },
          { title: "Paused", value: "paused" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tokenDefinitions",
      title: "Token Definitions",
      type: "array",
      description: "Optional token map. Leave empty to use dataset fields directly.",
      of: [{ type: "generatorTokenDefinition" }],
      validation: (Rule) => Rule.custom(validateUniqueTokenNames),
    }),
    defineField({
      name: "devOnly",
      title: "Dev Only",
      type: "boolean",
      initialValue: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "routeBase",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Generator Template",
        subtitle: subtitle || "",
      };
    },
  },
});
