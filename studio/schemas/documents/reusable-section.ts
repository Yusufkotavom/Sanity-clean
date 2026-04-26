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
      name: "blocks",
      title: "Reusable Blocks",
      type: "array",
      of: [
        { type: "hero-1" },
        { type: "hero-2" },
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
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: "hero",
              title: "Hero",
              of: ["hero-1", "hero-2"],
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
    },
    prepare({ title, slots, active }) {
      const slotLabel = Array.isArray(slots) && slots.length > 0 ? slots.join(", ") : "No slot";
      return {
        title: title || "Reusable Section",
        subtitle: `${active ? "Active" : "Inactive"} • ${slotLabel}`,
      };
    },
  },
});
