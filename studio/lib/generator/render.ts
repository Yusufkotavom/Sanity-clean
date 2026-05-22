import { buildGeneratedPagePath, buildGeneratorSlug } from "./slug";
import { buildGeneratorTokens, normalizeAngle } from "./variation";
import type { BuildGeneratedPageDraftInput, GeneratedPageDraft, ReferenceValue } from "./types";

const truncateSentence = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const truncated = value.slice(0, maxLength - 1).trimEnd();
  const safe = truncated.slice(0, truncated.lastIndexOf(" ")).trim();
  return `${safe || truncated}…`;
};

const buildReference = (id: string, existing?: ReferenceValue): ReferenceValue =>
  existing ?? { _type: "reference", _ref: id, _weak: true };

const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_:-]+)\s*\}\}/g;

const interpolateStringTokens = (value: string, tokens: Record<string, string>) =>
  value.replace(TOKEN_PATTERN, (_match, tokenName: string) => tokens[tokenName] ?? "");

const deepReplaceTokens = (value: unknown, tokens: Record<string, string>): unknown => {
  if (typeof value === "string") return interpolateStringTokens(value, tokens);
  if (Array.isArray(value)) return value.map((item) => deepReplaceTokens(item, tokens));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, deepReplaceTokens(entry, tokens)]),
    );
  }
  return value;
};

const getStableLineageKey = (value: { key?: string; _key?: string }, fallback: string) =>
  value.key ?? value._key ?? fallback;

export const buildGeneratedPageDraft = ({
  program,
  template,
  row,
  generatedAt,
}: BuildGeneratedPageDraftInput): GeneratedPageDraft => {
  const tokens = buildGeneratorTokens(template, row);

  // Use template routeBase/slugPattern, fallback to program
  const routeBase = template.routeBase || program.routeBase;
  const slugPattern = template.slugPattern || program.slugPattern;

  const slug = buildGeneratorSlug({
    routeBase,
    service: row.service,
    city: row.city,
    primaryKeyword: row.primaryKeyword,
    slugPattern,
  });

  const pagePath = buildGeneratedPagePath(slug);
  const pageTitle = `${tokens.primaryKeyword ?? row.primaryKeyword}${tokens.city ? ` ${tokens.city}` : ""}`.trim();

  // SEO from template seoMeta patterns
  const seoTitlePattern = template.seoMeta?.titlePattern;
  const seoDescPattern = template.seoMeta?.descriptionPattern;

  const seoTitle = seoTitlePattern
    ? interpolateStringTokens(seoTitlePattern, { ...tokens, routeBase })
    : pageTitle;

  const seoDescription = seoDescPattern
    ? truncateSentence(interpolateStringTokens(seoDescPattern, { ...tokens, routeBase }), 160)
    : truncateSentence(`${tokens.offer || row.offer || ""} ${tokens.localCondition || ""}`.trim(), 160);

  const secondaryKeywords = row.secondaryKeywords?.filter(Boolean) ?? [];

  const replacementTokens: Record<string, string> = {
    ...tokens,
    pageTitle,
    pagePath,
    seoTitle,
    seoDescription,
    routeBase,
    city: tokens.city ?? row.city ?? "",
    primaryKeyword: tokens.primaryKeyword ?? row.primaryKeyword,
    secondaryKeywords: secondaryKeywords.join(", "),
  };

  const templateBlocks = Array.isArray(template.blocks) ? template.blocks : [];
  const blocks = templateBlocks.map((block) => deepReplaceTokens(block, replacementTokens) as Record<string, unknown>);

  return {
    _type: "page",
    title: pageTitle,
    slug: { _type: "slug", current: slug },
    meta: {
      title: seoTitle,
      description: seoDescription,
      focusKeyword: tokens.primaryKeyword ?? row.primaryKeyword,
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
        ? { datasetId: program.dataset._id, dataset: buildReference(program.dataset._id, program.dataset.ref) }
        : {}),
      rowKey: getStableLineageKey(row, slug),
      keywordKey: row.primaryKeyword,
      version: "v4",
      aiUsed: false,
      ...(generatedAt ? { generatedAt } : {}),
    },
  };
};
