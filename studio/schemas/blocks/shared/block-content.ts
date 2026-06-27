import { defineType, defineArrayMember } from "sanity";
import { SquarePlay } from "lucide-react";
import { YouTubePreview } from "../../previews/youtube-preview";

export default defineType({
  title: "Block Content",
  name: "block-content",
  type: "array",
  initialValue: [
    {
      _key: "block-content-1",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: "block-content-1-span-1",
          _type: "span",
          marks: [],
          text: "Tulis konten di sini.",
        },
      ],
    },
  ],
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "isExternal",
                type: "boolean",
                title: "Is External",
                initialValue: false,
              },
              {
                name: "internalLink",
                type: "reference",
                title: "Internal Link",
                to: [
                  { type: "page" },
                  { type: "post" },
                  { type: "service" },
                  { type: "product" },
                  { type: "project" },
                ],
                hidden: ({ parent }) => parent?.isExternal,
              },
              {
                name: "href",
                title: "href",
                type: "url",
                hidden: ({ parent }) => !parent?.isExternal,
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
              {
                name: "target",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
                hidden: ({ parent }) => !parent?.isExternal,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineArrayMember({
      name: "youtube",
      type: "object",
      title: "YouTube",
      icon: SquarePlay,
      fields: [
        {
          name: "videoId",
          title: "Video ID",
          type: "string",
          description: "YouTube Video ID",
        },
      ],
      preview: {
        select: {
          title: "videoId",
        },
      },
      components: {
        preview: YouTubePreview,
      },
    }),
    defineArrayMember({
      name: "code",
      type: "code",
      options: {
        withFilename: true,
        language: "typescript",
        languageAlternatives: [
          { title: "TypeScript", value: "typescript" },
          { title: "JavaScript", value: "javascript" },
          { title: "JSX", value: "jsx" },
          { title: "TSX", value: "tsx" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "SCSS", value: "scss" },
          { title: "JSON", value: "json" },
          { title: "Python", value: "python" },
          { title: "PHP", value: "php" },
          { title: "Ruby", value: "ruby" },
          { title: "Shell", value: "shell" },
          { title: "Markdown", value: "markdown" },
          { title: "YAML", value: "yaml" },
          { title: "GraphQL", value: "graphql" },
          { title: "SQL", value: "sql" },
        ],
      },
    }),
    defineArrayMember({
      name: "markdownTable",
      type: "object",
      title: "Markdown Table",
      fields: [
        {
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              name: "markdownTableRow",
              type: "object",
              fields: [
                {
                  name: "isHeader",
                  type: "boolean",
                  title: "Header Row",
                  initialValue: false,
                },
                {
                  name: "cells",
                  title: "Cells",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                },
              ],
              preview: {
                select: {
                  isHeader: "isHeader",
                  cells: "cells",
                },
                prepare({ isHeader, cells }) {
                  const values = Array.isArray(cells) ? cells.filter(Boolean) : [];
                  return {
                    title: values.join(" | ") || "Empty row",
                    subtitle: isHeader ? "Header" : "Body",
                  };
                },
              },
            }),
          ],
        },
      ],
      preview: {
        select: {
          rows: "rows",
        },
        prepare({ rows }) {
          const count = Array.isArray(rows) ? rows.length : 0;
          return {
            title: "Markdown Table",
            subtitle: `${count} row${count === 1 ? "" : "s"}`,
          };
        },
      },
    }),
    defineArrayMember({
      type: "legacy-rich-content",
    }),
    defineArrayMember({
      name: "inline-button",
      type: "object",
      title: "CTA Button",
      fields: [
        { name: "text", type: "string", title: "Button Text" },
        {
          name: "link",
          type: "link",
          title: "Link",
        },
      ],
      preview: {
        select: {
          title: "text",
        },
        prepare({ title }) {
          return {
            title: title || "Button",
            subtitle: "CTA Button",
          };
        },
      },
    }),
    defineArrayMember({ type: "hero-1" }),
    defineArrayMember({ type: "hero-2" }),
    defineArrayMember({ type: "hero-vercel" }),
    defineArrayMember({ type: "section-header" }),
    defineArrayMember({ type: "split-row" }),
    defineArrayMember({ type: "grid-row" }),
    defineArrayMember({ type: "carousel-1" }),
    defineArrayMember({ type: "carousel-2" }),
    defineArrayMember({ type: "timeline-row" }),
    defineArrayMember({ type: "cta-1" }),
    defineArrayMember({ type: "whatsapp-cta" }),
    defineArrayMember({ type: "logo-cloud-1" }),
    defineArrayMember({ type: "faqs" }),
    defineArrayMember({ type: "form-newsletter" }),
    defineArrayMember({ type: "all-posts" }),
    defineArrayMember({ type: "company-info" }),
    defineArrayMember({ type: "testimonials-block" }),
    defineArrayMember({ type: "pricing-block" }),
    defineArrayMember({ type: "features-package-block" }),
    defineArrayMember({ type: "service-types-block" }),
    defineArrayMember({ type: "problem-solution-block" }),
    defineArrayMember({ type: "quote-spotlight-block" }),
    defineArrayMember({ type: "block-preset-ref" }),
  ],
});
