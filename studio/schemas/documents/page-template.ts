import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { LayoutTemplate } from "lucide-react";
import pageBlocks from "../blocks/shared/page-blocks";

const TEMPLATE_VARIANTS = [
  { title: "Service Hero", value: "service-hero" },
  { title: "Local Proof", value: "local-proof" },
  { title: "Pricing Focus", value: "pricing-focus" },
  { title: "Generic Company", value: "generic-company" },
];

const TEMPLATE_LANES = [
  { title: "Website", value: "website" },
  { title: "Software", value: "software" },
  { title: "Printing", value: "printing" },
  { title: "Generic Company", value: "generic" },
];

const LEGACY_RUNTIME_NOTE =
  "Legacy templating field. Kept for migration/reference only and no longer drives the preferred Generator V2 workflow.";

export default defineType({
  name: "pageTemplate",
  title: "Legacy Page Template",
  type: "document",
  icon: LayoutTemplate,
  groups: [
    { name: "content", title: "Content" },
    { name: "hero", title: "Hero" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      group: "settings",
      description:
        "Legacy routing/runtime setting. Keep only for migration reference until legacy templating is fully retired.",
      options: {
        list: TEMPLATE_VARIANTS,
        layout: "dropdown",
      },
      initialValue: "service-hero",
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const parent = context.document as { lane?: string } | null;
          if (value === "generic-company" && parent?.lane && parent.lane !== "generic") {
            return "Variant Generic Company harus memakai lane generic.";
          }
          return true;
        }),
      hidden: true,
    }),
    defineField({
      name: "lane",
      title: "Lane",
      type: "string",
      group: "settings",
      options: {
        list: TEMPLATE_LANES,
        layout: "radio",
      },
      initialValue: "generic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trustMode",
      title: "Trust Mode",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Safe", value: "safe" },
          { title: "Aggressive Marketing", value: "aggressive" },
        ],
        layout: "radio",
      },
      initialValue: "aggressive",
    }),
    defineField({
      name: "sourcePolicy",
      title: "Source of Truth Policy",
      type: "templateSourcePolicy",
      group: "settings",
    }),
    defineField({
      name: "isHybrid",
      title: "Hybrid Template",
      type: "boolean",
      group: "settings",
      description: `${LEGACY_RUNTIME_NOTE} The current runtime no longer consumes this field.`,
      initialValue: false,
      hidden: true,
    }),
    defineField({
      name: "shellId",
      title: "Shell ID",
      type: "string",
      group: "settings",
      description:
        "ID shell code-owned (mis. percetakan, pembuatan-website, software).",
    }),
    defineField({
      name: "topBlockCountDefault",
      title: "Top Block Count Default",
      type: "number",
      group: "settings",
      description: `${LEGACY_RUNTIME_NOTE} The current runtime no longer consumes this field.`,
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
      hidden: true,
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "structured",
      title: "Structured Copy",
      type: "templateRewriteCopy",
      group: "content",
    }),
    {
      ...pageBlocks,
      title: "Legacy Page Blocks",
      description: `${LEGACY_RUNTIME_NOTE} The current runtime no longer consumes blocks from legacy template documents.`,
      hidden: true,
    },
    defineField({
      name: "metaDefaults",
      title: "Meta Defaults",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Title",
        }),
        defineField({
          name: "description",
          type: "text",
          title: "Description",
          rows: 3,
        }),
        defineField({
          name: "canonicalUrl",
          type: "url",
          title: "Canonical URL Override",
        }),
        defineField({
          name: "focusKeyword",
          type: "string",
          title: "Focus Keyword",
        }),
        defineField({
          name: "secondaryKeywords",
          type: "array",
          title: "Secondary Keywords",
          of: [{ type: "string" }],
          options: { sortable: true },
        }),
        defineField({
          name: "noindex",
          title: "No Index",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "image",
          type: "image",
          title: "Image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
            }),
          ],
        }),
      ],
    }),
    orderRankField({ type: "pageTemplate" }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
      lane: "lane",
      isHybrid: "isHybrid",
    },
    prepare({ title, variant, lane, isHybrid }) {
      return {
        title: title || "Page Template",
        subtitle: `${lane || "generic"} · ${variant || "template"}${isHybrid ? " · hybrid" : ""}`,
      };
    },
  },
});
