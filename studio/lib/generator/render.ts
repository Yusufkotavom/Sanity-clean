import { buildGeneratedPagePath, buildGeneratorSlug } from "./slug";
import { buildFaqCategory, buildGeneratorTokens, buildSectionPlan } from "./variation";
import type { BuildGeneratedPageDraftInput, GeneratedPageDraft, GeneratorSectionPlan, ReferenceValue } from "./types";

const buildPortableText = (text: string, key: string) => [
  {
    _key: `${key}-block`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  },
];

const buildReference = (id: string, existing?: ReferenceValue): ReferenceValue =>
  existing ?? {
    _type: "reference",
    _ref: id,
    _weak: true,
  };

const toHeroBlock = (section: GeneratorSectionPlan, title: string, description: string, pagePath: string) => ({
  _type: "hero-1",
  _key: section.key,
  tagLine: section.title,
  title,
  body: buildPortableText(description, section.key),
  links: [
    {
      _key: `${section.key}-link-primary`,
      _type: "link",
      isExternal: true,
      title: "Konsultasi Sekarang",
      href: pagePath,
      target: false,
      buttonVariant: "default",
    },
    {
      _key: `${section.key}-link-secondary`,
      _type: "link",
      isExternal: true,
      title: "Lihat Detail Layanan",
      href: pagePath,
      buttonVariant: "outline",
    },
  ],
});

const toValuePropsBlock = (section: GeneratorSectionPlan, title: string, description: string) => ({
  _type: "value-props-block",
  _key: section.key,
  title,
  description,
  valueProps: [
    {
      _key: `${section.key}-value-1`,
      icon: "01",
      title: `${title} yang lebih terarah`,
      description,
    },
    {
      _key: `${section.key}-value-2`,
      icon: "02",
      title: "Eksekusi lebih konsisten",
      description: `Draft ini menjaga arah ${section.key.replace(/-/g, " ")} tetap konsisten tanpa AI.`,
    },
    {
      _key: `${section.key}-value-3`,
      icon: "03",
      title: "Masih mudah disunting manual",
      description: "Output tetap berupa page biasa sehingga editor masih bisa merapikan copy akhir tanpa mengulang generator.",
    },
  ],
});

const toProblemSolutionBlock = (section: GeneratorSectionPlan, title: string, description: string) => ({
  _type: "problem-solution-block",
  _key: section.key,
  title,
  problems: [
    `Pesan ${title.toLowerCase()} belum cukup spesifik untuk calon pelanggan lokal.`,
    `Halaman butuh jalur keputusan yang lebih jelas untuk kata kunci target.`,
  ],
  solutionTitle: "Solusi deterministik",
  solution: description,
});

const toFaqBlock = (section: GeneratorSectionPlan, title: string, description: string, category: string) => ({
  _type: "faq-block",
  _key: section.key,
  title,
  description,
  category,
});

const toPricingBlock = (section: GeneratorSectionPlan, title: string, description: string, category: string) => ({
  _type: "pricing-block",
  _key: section.key,
  title,
  description,
  category,
});

const sectionPlanToBlock = (
  section: GeneratorSectionPlan,
  pageTitle: string,
  description: string,
  pagePath: string,
  faqCategory: string,
) => {
  switch (section.sectionType) {
    case "hero-1":
      return toHeroBlock(section, pageTitle, description, pagePath);
    case "problem-solution-block":
      return toProblemSolutionBlock(section, section.title, description);
    case "faq-block":
      return toFaqBlock(section, section.title, description, faqCategory);
    case "pricing-block":
      return toPricingBlock(section, section.title, description, faqCategory);
    case "value-props-block":
    default:
      return toValuePropsBlock(section, section.title, description);
  }
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
  });
  const pagePath = buildGeneratedPagePath(slug);
  const sectionPlan = buildSectionPlan(template, keywordSet, row);
  const pageTitle = `${tokens.primaryKeyword ?? keywordSet.primaryKeyword}${tokens.city ? ` ${tokens.city}` : ""}`.trim();
  const seoTitlePattern = program.defaultSeoPattern?.title?.trim();
  const seoDescriptionPattern = program.defaultSeoPattern?.description?.trim();
  const location = tokens.location ?? tokens.city ?? tokens.service ?? "target utama";
  const offer = tokens.offer ?? `Konsultasi ${tokens.service ?? keywordSet.primaryKeyword}`;
  const secondaryKeywords =
    Array.isArray(keywordSet.secondaryKeywords) && keywordSet.secondaryKeywords.length > 0
      ? keywordSet.secondaryKeywords
      : [];
  const description = seoDescriptionPattern
    ? `${seoDescriptionPattern} ${offer} di ${location}.`.trim()
    : `${pageTitle} untuk ${location} dengan fokus ${tokens.angle ?? "default"}.`;

  const blocks = sectionPlan.map((section) =>
    sectionPlanToBlock(
      section,
      seoTitlePattern ? `${pageTitle} | ${seoTitlePattern}` : pageTitle,
      `${description} ${section.copy}`.trim(),
      pagePath,
      buildFaqCategory(template, row),
    ),
  );

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
      version: "v2",
      aiUsed: false,
      ...(generatedAt ? { generatedAt } : {}),
    },
  };
};
