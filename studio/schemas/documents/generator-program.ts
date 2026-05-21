import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const validateRouteBase = (value: unknown) => {
  if (typeof value !== "string") {
    return "Route base is required.";
  }

  if (value !== value.trim()) {
    return "Route base cannot have leading or trailing spaces.";
  }

  if (!/^\/[a-z0-9/-]*$/.test(value)) {
    return "Route base must start with / and use lowercase path-safe characters only.";
  }

  if (value.includes("//")) {
    return "Route base cannot contain double slashes.";
  }

  if (value.length > 1 && value.endsWith("/")) {
    return "Route base cannot end with a trailing slash.";
  }

  return true;
};


const validateSlugPattern = (value: unknown) => {
  if (typeof value !== "string") {
    return "Slug pattern is required.";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "Slug pattern is required.";
  }

  const allowedTokens = ["routeBase", "city", "service", "primaryKeyword"];
  const tokens = Array.from(trimmed.matchAll(/\{\{\s*([a-zA-Z0-9_:-]+)\s*\}\}/g)).map((m) => m[1]);

  for (const token of tokens) {
    if (!allowedTokens.includes(token)) {
      return `Unsupported token: {{${token}}}. Allowed tokens: ${allowedTokens.join(", ")}.`;
    }
  }

  if (!tokens.includes("routeBase")) {
    return "Slug pattern must include {{routeBase}}.";
  }

  return true;
};
export default defineType({
  name: "generatorProgram",
  title: "Generator Program",
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
    orderRankField({ type: "generatorProgram" }),
    defineField({
      name: "template",
      title: "Template",
      type: "reference",
      to: [{ type: "generatorTemplate" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dataset",
      title: "Dataset",
      type: "reference",
      to: [{ type: "generatorDataset" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "programType",
      title: "Program Type",
      type: "string",
      options: {
        list: [
          { title: "Landing Pages", value: "landing-pages" },
          { title: "Location Pages", value: "location-pages" },
        ],
        layout: "radio",
      },
      initialValue: "landing-pages",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "generationMode",
      title: "Generation Mode",
      type: "string",
      options: {
        list: [
          { title: "Preview", value: "preview" },
          { title: "Batch", value: "batch" },
        ],
        layout: "radio",
      },
      initialValue: "preview",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "routeBase",
      title: "Route Base",
      type: "string",
      validation: (Rule) => Rule.required().custom(validateRouteBase),
    }),
    defineField({
      name: "slugTokenReference",
      title: "Slug Token Quick Copy",
      type: "text",
      rows: 4,
      readOnly: true,
      initialValue:
        "{{routeBase}}\n{{city}}\n{{service}}\n{{primaryKeyword}}",
      description:
        "Copy token dari sini lalu tempel ke Slug Pattern.",
    }),

    defineField({
      name: "slugPattern",
      title: "Slug Pattern",
      type: "string",
      description:
        "Custom pattern for generated slug. Supported tokens: {{routeBase}}, {{city}}, {{service}}, {{primaryKeyword}}.",
      initialValue: "{{routeBase}}-{{service}}-{{city}}-{{primaryKeyword}}",
      validation: (Rule) => Rule.required().custom(validateSlugPattern),
    }),
    defineField({
      name: "defaultSeoPattern",
      title: "Default SEO Pattern",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
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
      name: "aiMode",
      title: "AI Mode",
      type: "string",
      options: {
        list: [
          { title: "Off", value: "off" },
          { title: "Prepared", value: "prepared" },
        ],
        layout: "radio",
      },
      initialValue: "off",
      validation: (Rule) => Rule.required(),
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
      status: "status",
      programType: "programType",
    },
    prepare({ title, subtitle, status, programType }) {
      return {
        title: title || "Generator Program",
        subtitle: [status || "draft", programType, subtitle].filter(Boolean).join(" · "),
      };
    },
  },
});
