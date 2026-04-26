import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const validateUniqueKeys = (value: unknown, label: string) => {
  if (!Array.isArray(value)) {
    return true;
  }

  const seen = new Set<string>();
  for (const entry of value) {
    const key = typeof entry === "object" && entry !== null ? (entry as { key?: unknown }).key : undefined;
    if (typeof key !== "string" || key.length === 0) {
      continue;
    }
    if (seen.has(key)) {
      return `${label} keys must be unique.`;
    }
    seen.add(key);
  }

  return true;
};

const validateSectionKeys = (value: unknown, context: { parent?: unknown }) => {
  if (!Array.isArray(value) || value.length === 0) {
    return true;
  }

  const parent = (context.parent ?? {}) as { sectionVariants?: Array<{ key?: string }> };
  const variantKeys = new Set(
    (parent.sectionVariants ?? []).map((variant) => variant?.key).filter((key): key is string => Boolean(key)),
  );

  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "string" || !variantKeys.has(entry)) {
      return "Each section key must match a key defined in Section Variants.";
    }

    if (seen.has(entry)) {
      return "Section keys must be unique within each section list.";
    }

    seen.add(entry);
  }

  return true;
};

const validateNoSectionOverlap = (
  currentFieldName: "baseSections" | "optionalSections",
  value: unknown,
  context: { parent?: unknown },
) => {
  if (!Array.isArray(value) || value.length === 0) {
    return true;
  }

  const parent = (context.parent ?? {}) as {
    baseSections?: unknown[];
    optionalSections?: unknown[];
  };
  const siblingFieldName = currentFieldName === "baseSections" ? "optionalSections" : "baseSections";
  const siblingValues = parent[siblingFieldName];

  if (!Array.isArray(siblingValues) || siblingValues.length === 0) {
    return true;
  }

  const siblingKeys = new Set(siblingValues.filter((entry): entry is string => typeof entry === "string"));
  const overlap = value.find((entry) => typeof entry === "string" && siblingKeys.has(entry));
  return overlap === undefined ? true : "Base Sections and Optional Sections cannot share the same section key.";
};

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

const validateSectionVariantTokens = (value: unknown, context: { parent?: unknown }) => {
  if (!Array.isArray(value) || value.length === 0) {
    return true;
  }

  const parent = (context.parent ?? {}) as {
    tokenDefinitions?: Array<{ name?: string }>;
  };
  const tokenNames = new Set(
    (parent.tokenDefinitions ?? [])
      .map((token) => token?.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0),
  );

  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const variant = entry as { key?: unknown; requiredTokens?: unknown };
    const requiredTokens = Array.isArray(variant.requiredTokens) ? variant.requiredTokens : [];

    for (const tokenName of requiredTokens) {
      if (typeof tokenName !== "string" || !tokenNames.has(tokenName)) {
        return `Section variant ${typeof variant.key === "string" ? `"${variant.key}"` : ""} references an unknown required token.`;
      }
    }
  }

  return true;
};

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
      description: "Reusable visual direction for many service categories.",
      options: {
        list: [
          { title: "Editorial Grid", value: "editorial-grid" },
          { title: "Proof Showcase", value: "proof-showcase" },
          { title: "Pricing Spotlight", value: "pricing-spotlight" },
          { title: "Conversion Stack", value: "conversion-stack" },
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
      description: "Planned motion rhythm used by the visual generator templates.",
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
      description: "Short operator note about when this visual template works best.",
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
      name: "baseSections",
      title: "Base Sections",
      type: "array",
      description: "Ordered section keys that must always render.",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom(validateSectionKeys)
          .custom((value, context) => validateNoSectionOverlap("baseSections", value, context)),
    }),
    defineField({
      name: "optionalSections",
      title: "Optional Sections",
      type: "array",
      description: "Ordered optional section keys that may render when selected.",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .custom(validateSectionKeys)
          .custom((value, context) => validateNoSectionOverlap("optionalSections", value, context)),
    }),
    defineField({
      name: "variationRules",
      title: "Variation Rules",
      type: "array",
      of: [{ type: "string" }],
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
      of: [{ type: "generatorTokenDefinition" }],
      validation: (Rule) => Rule.required().min(1).custom(validateUniqueTokenNames),
    }),
    defineField({
      name: "sectionVariants",
      title: "Section Variants",
      type: "array",
      description: "Authoritative section definitions keyed by the section key field.",
      of: [{ type: "generatorSectionVariant" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((value) => validateUniqueKeys(value, "Section variant"))
          .custom(validateSectionVariantTokens),
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
