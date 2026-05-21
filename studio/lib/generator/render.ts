import { buildGeneratedPagePath, buildGeneratorSlug } from "./slug";
import { buildGeneratorTokens, normalizeAngle } from "./variation";
import type { BuildGeneratedPageDraftInput, GeneratedPageDraft, ReferenceValue } from "./types";

const truncateSentence = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength - 1).trimEnd();
  const safe = truncated.slice(0, truncated.lastIndexOf(" ")).trim();
  return `${safe || truncated}…`;
};

const buildMetaDescription = ({
  seoDescriptionPattern,
  offer,
  location,
  service,
  angle,
}: {
  seoDescriptionPattern?: string;
  offer: string;
  location: string;
  service?: string;
  angle?: string;
}) => {
  const sentence = seoDescriptionPattern
    ? `${seoDescriptionPattern} ${offer} di ${location}.`
    : `${service || "Layanan ini"} untuk ${location} dengan fokus ${angle || "hasil yang lebih jelas"}.`;

  return truncateSentence(sentence.replace(/\s+/g, " ").trim(), 160);
};

const buildReference = (id: string, existing?: ReferenceValue): ReferenceValue =>
  existing ?? {
    _type: "reference",
    _ref: id,
    _weak: true,
  };

const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_:-]+)\s*\}\}/g;

const interpolateStringTokens = (value: string, tokens: Record<string, string>) =>
  value.replace(TOKEN_PATTERN, (_match, tokenName: string) => tokens[tokenName] ?? "");

const deepReplaceTokens = (value: unknown, tokens: Record<string, string>): unknown => {
  if (typeof value === "string") {
    return interpolateStringTokens(value, tokens);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepReplaceTokens(item, tokens));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, deepReplaceTokens(entry, tokens)]),
    );
  }

  return value;
};

const getStableLineageKey = (value: { key?: string; _key?: string }, fallback: string) => value.key ?? value._key ?? fallback;

export const buildGeneratedPageDraft = ({
  program,
  template,
  keywordSet,
  row,
  generatedAt,
}: BuildGeneratedPageDraftInput): GeneratedPageDraft => {
  const tokens = buildGeneratorTokens(template, keywordSet, row);
  const slug = buildGeneratorSlug({
    routeBase: program.routeBase,
    service: row.service,
    city: row.city,
    primaryKeyword: keywordSet.primaryKeyword,
    slugPattern: program.slugPattern,
  });
  const pagePath = buildGeneratedPagePath(slug);
  const pageTitle = `${tokens.primaryKeyword ?? keywordSet.primaryKeyword}${tokens.city ? ` ${tokens.city}` : ""}`.trim();
  const seoTitlePattern = program.defaultSeoPattern?.title?.trim();
  const seoDescriptionPattern = program.defaultSeoPattern?.description?.trim();
  const location = tokens.location ?? tokens.city ?? tokens.service ?? "target utama";
  const offer = tokens.offer ?? `Konsultasi ${tokens.service ?? keywordSet.primaryKeyword}`;
  const service = tokens.service ?? row.service ?? keywordSet.primaryKeyword;
  const angle = tokens.angle ?? normalizeAngle(keywordSet.angle);
  const secondaryKeywords =
    Array.isArray(keywordSet.secondaryKeywords) && keywordSet.secondaryKeywords.length > 0
      ? keywordSet.secondaryKeywords
      : [];

  const description = buildMetaDescription({
    seoDescriptionPattern,
    offer,
    location,
    service,
    angle,
  });

  const replacementTokens = {
    ...tokens,
    pageTitle,
    pagePath,
    seoTitle: seoTitlePattern ? `${pageTitle} | ${seoTitlePattern}` : pageTitle,
    seoDescription: description,
    routeBase: program.routeBase,
    location,
    offer,
    service,
    angle,
    city: tokens.city ?? row.city ?? "",
    primaryKeyword: tokens.primaryKeyword ?? keywordSet.primaryKeyword,
    secondaryKeywords: secondaryKeywords.join(", "),
  };

  const templateBlocks = Array.isArray(template.blocks) ? template.blocks : [];
  const blocks = templateBlocks.map((block) => deepReplaceTokens(block, replacementTokens) as Record<string, unknown>);

  return {
    _type: "page",
    title: pageTitle,
    slug: {
      _type: "slug",
      current: slug,
    },
    meta: {
      title: seoTitlePattern ? `${pageTitle} | ${seoTitlePattern}` : pageTitle,
      description,
      focusKeyword: tokens.primaryKeyword ?? keywordSet.primaryKeyword,
      secondaryKeywords,
      noindex: false,
    },
    topBlockCount: 0,
    blocks,
    generator: {
      programId: program._id,
      program: buildReference(program._id, program.ref),
      templateId: template._id,
      template: buildReference(template._id, template.ref),
      ...(program.dataset?._id
        ? {
            datasetId: program.dataset._id,
            dataset: buildReference(program.dataset._id, program.dataset.ref),
          }
        : {}),
      rowKey: getStableLineageKey(row, slug),
      keywordKey: getStableLineageKey(keywordSet, keywordSet.primaryKeyword),
      version: "v3",
      aiUsed: false,
      ...(generatedAt ? { generatedAt } : {}),
    },
  };
};
