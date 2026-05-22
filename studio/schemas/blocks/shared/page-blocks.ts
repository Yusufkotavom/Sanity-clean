import { defineField } from "sanity";

/**
 * Shared page blocks field definition.
 * Reusable across page, post, service, and project documents.
 */
const pageBlocks = defineField({
  name: "blocks",
  title: "Page Blocks",
  type: "array",
  group: "content",
  description: "Optional rich page sections (hero, grid, CTA, FAQ, etc.)",
  of: [
    { type: "hero-1" },
    { type: "hero-2" },
    { type: "hero-vercel" },
    { type: "stats-hero-block" },
    { type: "section-header" },
    { type: "split-row" },
    { type: "grid-row" },
    { type: "carousel-1" },
    { type: "carousel-2" },
    { type: "timeline-row" },
    { type: "cta-1" },
    { type: "whatsapp-cta" },
    { type: "logo-cloud-1" },
    { type: "faqs" },
    { type: "form-newsletter" },
    { type: "all-posts" },
    { type: "legacy-rich-content" },
    { type: "company-info" },
    { type: "testimonials-block" },
    { type: "pricing-block" },
    { type: "faq-block" },
    { type: "benefits-block" },
    { type: "features-package-block" },
    { type: "service-types-block" },
    { type: "problem-solution-block" },
    { type: "value-props-block" },
  ],
  options: {
    insertMenu: {
      groups: [
        {
          name: "hero",
          title: "Hero",
          of: ["hero-1", "hero-2", "hero-vercel", "stats-hero-block"],
        },
        {
          name: "logo-cloud",
          title: "Logo Cloud",
          of: ["logo-cloud-1"],
        },
        {
          name: "section-header",
          title: "Section Header",
          of: ["section-header"],
        },
        {
          name: "grid",
          title: "Grid",
          of: ["grid-row"],
        },
        {
          name: "split",
          title: "Split",
          of: ["split-row"],
        },
        {
          name: "carousel",
          title: "Carousel",
          of: ["carousel-1", "carousel-2"],
        },
        {
          name: "timeline",
          title: "Timeline",
          of: ["timeline-row"],
        },
        {
          name: "cta",
          title: "CTA",
          of: ["cta-1", "whatsapp-cta"],
        },
        {
          name: "faqs",
          title: "FAQs",
          of: ["faqs"],
        },
        {
          name: "forms",
          title: "Forms",
          of: ["form-newsletter"],
        },
        {
          name: "all-posts",
          title: "All Posts",
          of: ["all-posts"],
        },
        {
          name: "legacy",
          title: "Legacy",
          of: ["legacy-rich-content"],
        },
        {
          name: "seo",
          title: "SEO",
          of: [
            "company-info",
            "testimonials-block",
            "pricing-block",
            "faq-block",
            "benefits-block",
            "features-package-block",
            "service-types-block",
            "problem-solution-block",
            "value-props-block",
          ],
        },
      ],
      views: [
        {
          name: "grid",
          previewImageUrl: (block: string) =>
            `/static/images/preview/${block}.jpg`,
        },
        { name: "list" },
      ],
    },
  },
});

export default pageBlocks;
