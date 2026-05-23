import { defineField, defineType } from "sanity";
import { Blocks } from "lucide-react";
import pageBlocks from "../blocks/shared/page-blocks";

export default defineType({
  name: "blockPreset",
  type: "document",
  title: "Block Preset",
  icon: Blocks,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      description: "Short note about when to use this preset.",
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Hero", value: "hero" },
          { title: "Content", value: "content" },
          { title: "CTA", value: "cta" },
          { title: "Social Proof", value: "social-proof" },
          { title: "FAQ", value: "faq" },
          { title: "Pricing", value: "pricing" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    {
      ...pageBlocks,
      name: "blocks",
      title: "Preset Blocks",
      description: "The blocks that will be inserted when this preset is referenced.",
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      blockCount: "blocks.length",
    },
    prepare({ title, category }) {
      return {
        title: title || "Block Preset",
        subtitle: category || "preset",
      };
    },
  },
});
