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
  "benefits-block",
  "features-package-block",
  "service-types-block",
  "problem-solution-block",
  "value-props-block",
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
      name: "visualPreset",
      title: "Visual Preset",
      type: "string",
      description: "Reusable visual direction label for many service categories.",
      options: {
        list: [
          { title: "Editorial Grid", value: "editorial-grid" },
          { title: "Proof Showcase", value: "proof-showcase" },
          { title: "Pricing Spotlight", value: "pricing-spotlight" },
          { title: "Conversion Stack", value: "conversion-stack" },
          { title: "Immersive Story", value: "immersive-story" },
          { title: "Trust Matrix", value: "trust-matrix" },
          { title: "Authority Canvas", value: "authority-canvas" },
          { title: "Offer Funnel", value: "offer-funnel" },
          { title: "Process Mosaic", value: "process-mosaic" },
        ],
        layout: "radio",
      },
      initialValue: "editorial-grid",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "motionPreset",
      title: "Motion Preset",
      type: "string",
      description: "Metadata-only motion rhythm note used for team alignment.",
      options: {
        list: [
          { title: "Calm Reveal", value: "calm-reveal" },
          { title: "Stagger Rise", value: "stagger-rise" },
          { title: "Spotlight Flow", value: "spotlight-flow" },
          { title: "Crisp Snap", value: "crisp-snap" },
        ],
        layout: "radio",
      },
      initialValue: "calm-reveal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "styleNotes",
      title: "Style Notes",
      type: "text",
      rows: 3,
      description: "Short operator note about when this template works best.",
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
      name: "designFamily",
      title: "Design Family",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      subtitle: "visualPreset",
      slug: "slug.current",
    },
    prepare({ title, subtitle, slug }) {
      return {
        title: title || "Generator Template",
        subtitle: [subtitle, slug].filter(Boolean).join(" · "),
      };
    },
  },
});
