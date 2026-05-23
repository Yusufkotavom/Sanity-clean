import { defineField, defineType } from "sanity";

const SECTION_TYPE_OPTIONS = [
  { title: "Hero", value: "hero-1" },
  { title: "Stats Hero", value: "stats-hero-block" },
  { title: "Value Props", value: "value-props-block" },
  { title: "Features Package", value: "features-package-block" },
  { title: "Company Info", value: "company-info" },
  { title: "Problem / Solution", value: "problem-solution-block" },
  { title: "Service Types", value: "service-types-block" },
  { title: "Pricing", value: "pricing-block" },
  { title: "Testimonials", value: "testimonials-block" },
  { title: "FAQ", value: "faq-block" },
  { title: "Split Row", value: "split-row" },
  { title: "Timeline", value: "timeline-row" },
  { title: "CTA Panel", value: "cta-1" },
];

const COLOR_VARIANT_OPTIONS = [
  { title: "Background", value: "background" },
  { title: "Card", value: "card" },
  { title: "Muted", value: "muted" },
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
  { title: "Destructive", value: "destructive" },
];

export default defineType({
  name: "generatorSectionVariant",
  title: "Generator Section Variant",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sectionType",
      title: "Section Type",
      type: "string",
      description: "Supported renderer block for this reusable visual section.",
      options: {
        list: SECTION_TYPE_OPTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "colorVariant",
      title: "Color Variant Override",
      type: "string",
      description: "Optional per-section override. Leave empty to follow the template visual preset.",
      options: {
        list: COLOR_VARIANT_OPTIONS,
        layout: "radio",
      },
    }),
    defineField({
      name: "requiredTokens",
      title: "Required Tokens",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "optional",
      title: "Optional",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sectionType",
    },
  },
});
