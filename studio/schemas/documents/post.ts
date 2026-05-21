import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";
import meta from "../blocks/shared/meta";
import pageBlocks from "../blocks/shared/page-blocks";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: FileText,
  groups: [
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
    {
      name: "settings",
      title: "Settings",
    },
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
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "settings",
      to: { type: "author" },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "settings",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "settings",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    pageBlocks,
    defineField({
      name: "affiliateItems",
      title: "Affiliate / Review Items",
      type: "array",
      group: "content",
      of: [{ type: "affiliateItem" }],
      description: "Products, services, or software being reviewed in this post. Auto-generates Review/ItemList JSON-LD.",
    }),
    defineField({
      name: "overallRating",
      title: "Overall Rating",
      type: "number",
      group: "content",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
      description: "Your overall rating for a single-product review post (1-5).",
    }),
    defineField({
      name: "verdict",
      title: "Verdict / Kesimpulan",
      type: "text",
      group: "content",
      rows: 3,
      description: "Summary conclusion for the review.",
    }),
    defineField({
      name: "aggregateRating",
      title: "Aggregate Rating",
      type: "aggregateRating",
      group: "seo",
      description: "Override rating. If empty, falls back to SEO Settings default.",
    }),
    meta,
  ],
  description:
    "Tip: use document action 'Generate OG Image' to auto-create and save meta image from title.",

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
