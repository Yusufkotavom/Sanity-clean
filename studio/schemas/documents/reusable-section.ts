import { defineField, defineType } from "sanity";
import { Blocks } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

const REUSABLE_PLACEMENTS = [
  { title: "Before Header", value: "beforeHeader" },
  { title: "After Header", value: "afterHeader" },
  { title: "Before Main Content", value: "beforeMainContent" },
  { title: "After Main Content", value: "afterMainContent" },
  { title: "After Hero", value: "afterHero" },
  { title: "Before Final CTA", value: "beforeFinalCta" },
  { title: "Before Footer", value: "beforeFooter" },
  { title: "After Footer", value: "afterFooter" },
];

export default defineType({
  name: "reusableSection",
  type: "document",
  title: "Reusable Section",
  icon: Blocks,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      description: "Only active reusable sections are rendered on the frontend.",
      initialValue: true,
    }),
    defineField({
      name: "priority",
      type: "number",
      title: "Priority",
      description: "Lower value renders earlier in each selected placement slot.",
      initialValue: 100,
    }),
    defineField({
      name: "placements",
      type: "array",
      title: "Placement Slots",
      description: "Choose where this reusable section should be displayed.",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
      options: {
        list: REUSABLE_PLACEMENTS,
        layout: "grid",
      },
    }),
    defineField({
      name: "routeMode",
      type: "string",
      title: "Route Scope",
      description:
        "Apply this section everywhere, or only on selected page slugs managed in Sanity/frontend routing.",
      initialValue: "all",
      options: {
        list: [
          { title: "All Matching Routes", value: "all" },
          { title: "Only Selected Slugs", value: "selected" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "routeSlugs",
      type: "array",
      title: "Route Keys",
      description:
        "Optional route keys without a leading slash. Examples: index, services, blog/post-slug, pembuatan-website/jakarta.",
      hidden: ({ parent }) => (parent as { routeMode?: string } | undefined)?.routeMode !== "selected",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const routeMode = (context.parent as { routeMode?: string } | undefined)?.routeMode;

          if (routeMode === "selected" && (!Array.isArray(value) || value.length === 0)) {
            return "Add at least one route slug when using selected route scope.";
          }

          return true;
        }),
    }),
    defineField({
      name: "blocks",
      title: "Reusable Blocks",
      type: "array",
      of: [
        { type: "hero-1" },
        { type: "hero-2" },
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
        { type: "features-package-block" },
        { type: "service-types-block" },
        { type: "problem-solution-block" },
        { type: "tabs-section" },
        { type: "banner-section" },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: "hero",
              title: "Hero",
              of: ["hero-1", "hero-2", "stats-hero-block"],
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
              name: "tabs",
              title: "Tabs",
              of: ["tabs-section"],
            },
            {
              name: "timeline",
              title: "Timeline",
              of: ["timeline-row"],
            },
            {
              name: "cta",
              title: "CTA",
              of: ["cta-1", "whatsapp-cta", "banner-section"],
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
                "features-package-block",
                "service-types-block",
                "problem-solution-block",
              ],
            },
          ],
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/static/images/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
    }),
    orderRankField({ type: "reusableSection" }),
  ],
  preview: {
    select: {
      title: "title",
      slots: "placements",
      active: "isActive",
      routeMode: "routeMode",
      routeSlugs: "routeSlugs",
    },
    prepare({ title, slots, active, routeMode, routeSlugs }) {
      const slotLabel = Array.isArray(slots) && slots.length > 0 ? slots.join(", ") : "No slot";
      const routeLabel =
        routeMode === "selected" && Array.isArray(routeSlugs) && routeSlugs.length > 0
          ? ` • Routes: ${routeSlugs.join(", ")}`
          : "";
      return {
        title: title || "Reusable Section",
        subtitle: `${active ? "Active" : "Inactive"} • ${slotLabel}${routeLabel}`,
      };
    },
  },
});
