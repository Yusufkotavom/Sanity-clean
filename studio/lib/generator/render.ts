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

const DEFAULT_PADDING = {
  _type: "section-padding" as const,
  top: true,
  bottom: true,
};

const buildLink = (key: string, title: string, href: string, buttonVariant: "default" | "outline" = "default") => ({
  _key: key,
  _type: "link",
  isExternal: true,
  title,
  href,
  target: false,
  buttonVariant,
});

const resolveSectionColorVariant = (
  sectionColorVariant: string | undefined,
  visualPreset: string | undefined,
  sectionType: string,
  sectionKey: string,
) => {
  if (sectionColorVariant) {
    return sectionColorVariant;
  }

  const preset = visualPreset || "editorial-grid";

  if (preset === "proof-showcase") {
    if (sectionType === "testimonials-block") return "accent";
    if (sectionType === "service-types-block") return "secondary";
    if (sectionType === "pricing-block") return "card";
    return sectionKey === "highlights" ? "card" : "background";
  }

  if (preset === "pricing-spotlight") {
    if (sectionType === "pricing-block") return "primary";
    if (sectionType === "testimonials-block") return "muted";
    return sectionKey === "serviceTypes" ? "card" : "background";
  }

  if (preset === "conversion-stack") {
    if (sectionType === "service-types-block") return "accent";
    if (sectionType === "testimonials-block") return "secondary";
    return sectionKey === "finalCta" ? "primary" : "background";
  }

  if (sectionType === "service-types-block") return "card";
  if (sectionType === "testimonials-block") return "muted";
  if (sectionType === "pricing-block") return "secondary";
  return sectionKey === "highlights" ? "accent" : "background";
};

const toHeroBlock = (section: GeneratorSectionPlan, title: string, description: string, pagePath: string) => ({
  _type: "hero-1",
  _key: section.key,
  tagLine: section.title,
  title,
  body: buildPortableText(description, section.key),
  links: [
    buildLink(`${section.key}-link-primary`, "Konsultasi Sekarang", pagePath),
    buildLink(`${section.key}-link-secondary`, "Lihat Detail Layanan", pagePath, "outline"),
  ],
});

const toValuePropsBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
) => ({
  _type: "value-props-block",
  _key: section.key,
  title,
  description,
  colorVariant,
  padding: DEFAULT_PADDING,
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

const toProblemSolutionBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
) => ({
  _type: "problem-solution-block",
  _key: section.key,
  title,
  colorVariant,
  padding: DEFAULT_PADDING,
  problems: [
    `Pesan ${title.toLowerCase()} belum cukup spesifik untuk calon pelanggan lokal.`,
    `Halaman butuh jalur keputusan yang lebih jelas untuk kata kunci target.`,
  ],
  solutionTitle: "Solusi deterministik",
  solution: description,
});

const toFaqBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  category: string,
  colorVariant: string,
) => ({
  _type: "faq-block",
  _key: section.key,
  title,
  description,
  category,
  colorVariant,
  padding: DEFAULT_PADDING,
});

const toPricingBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  category: string,
  colorVariant: string,
) => ({
  _type: "pricing-block",
  _key: section.key,
  title,
  description,
  category,
  colorVariant,
  padding: DEFAULT_PADDING,
});

const toTestimonialsBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  category: string,
  colorVariant: string,
) => ({
  _type: "testimonials-block",
  _key: section.key,
  title,
  description,
  category,
  colorVariant,
  padding: DEFAULT_PADDING,
});

const toServiceTypesBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  colorVariant: string,
) => ({
  _type: "service-types-block",
  _key: section.key,
  title,
  description,
  colorVariant,
  padding: DEFAULT_PADDING,
  services: [
    {
      _key: `${section.key}-service-1`,
      title: `${title} Utama`,
      description,
      features: [
        "Struktur visual lebih rapi",
        "Copy tetap selaras dengan intent",
        "Masih mudah dikoreksi manual",
      ],
      price: "Mulai dari konsultasi kebutuhan",
      timeline: "Timeline menyesuaikan scope",
      badge: "Fokus Utama",
      link: {
        _key: `${section.key}-service-link-1`,
        _type: "link",
        isExternal: true,
        title: "Lihat Detail",
        href: pagePath,
        buttonVariant: "default",
      },
    },
    {
      _key: `${section.key}-service-2`,
      title: `${title} Pendukung`,
      description: "Cocok untuk variasi intent kedua tanpa membuat halaman terasa duplikat.",
      features: [
        "Sudut narasi berbeda",
        "CTA lebih spesifik",
        "Masih satu bahasa desain",
      ],
      price: "Disesuaikan dengan kebutuhan",
      timeline: "Bisa disusun bertahap",
      badge: "Variasi",
      link: {
        _key: `${section.key}-service-link-2`,
        _type: "link",
        isExternal: true,
        title: "Diskusikan",
        href: pagePath,
        buttonVariant: "outline",
      },
    },
  ],
});

const toSplitRowBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  colorVariant: string,
) => ({
  _type: "split-row",
  _key: section.key,
  colorVariant,
  padding: DEFAULT_PADDING,
  noGap: false,
  splitColumns: [
    {
      _key: `${section.key}-intro`,
      _type: "split-content",
      tagLine: section.title,
      title,
      body: buildPortableText(description, `${section.key}-intro`),
      link: buildLink(`${section.key}-link-primary`, "Diskusikan Struktur Halaman", pagePath),
    },
    {
      _key: `${section.key}-proofs`,
      _type: "split-info-list",
      list: [
        {
          _key: `${section.key}-proof-1`,
          _type: "split-info",
          title: "Pesan utama lebih cepat tertangkap",
          body: buildPortableText("Layout ini memecah manfaat, pembeda, dan CTA menjadi ritme baca yang lebih jelas.", `${section.key}-proof-1`),
          tags: ["Visual", "Clarity"],
        },
        {
          _key: `${section.key}-proof-2`,
          _type: "split-info",
          title: "Masih fleksibel untuk banyak jasa",
          body: buildPortableText("Template tetap generik di level struktur, lalu service, lokasi, dan keyword mengisi detailnya.", `${section.key}-proof-2`),
          tags: ["Reusable", "Multi Service"],
        },
      ],
    },
  ],
});

const toTimelineRowBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
) => ({
  _type: "timeline-row",
  _key: section.key,
  colorVariant,
  padding: DEFAULT_PADDING,
  timelines: [
    {
      _key: `${section.key}-timeline-1`,
      _type: "timelines-1",
      title: "Pilih sudut intent",
      tagLine: "Step 1",
      body: buildPortableText(`Keyword dipetakan ke angle yang tepat agar ${title.toLowerCase()} tidak terasa generik.`, `${section.key}-timeline-1`),
    },
    {
      _key: `${section.key}-timeline-2`,
      _type: "timelines-1",
      title: "Susun section visual",
      tagLine: "Step 2",
      body: buildPortableText(description, `${section.key}-timeline-2`),
    },
    {
      _key: `${section.key}-timeline-3`,
      _type: "timelines-1",
      title: "Siapkan CTA akhir",
      tagLine: "Step 3",
      body: buildPortableText("Output tetap berupa page biasa sehingga editor masih bisa memoles copy sebelum publish.", `${section.key}-timeline-3`),
    },
  ],
});

const toCtaBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  colorVariant: string,
) => ({
  _type: "cta-1",
  _key: section.key,
  colorVariant: colorVariant === "background" ? "primary" : colorVariant,
  sectionWidth: "default",
  stackAlign: "left",
  tagLine: section.title,
  title,
  body: buildPortableText(description, `${section.key}-cta`),
  links: [
    buildLink(`${section.key}-cta-primary`, "Mulai Diskusi", pagePath),
    buildLink(`${section.key}-cta-secondary`, "Lihat Detail", pagePath, "outline"),
  ],
});

const sectionPlanToBlock = (
  section: GeneratorSectionPlan,
  pageTitle: string,
  description: string,
  pagePath: string,
  faqCategory: string,
  visualPreset: string | undefined,
) => {
  const colorVariant = resolveSectionColorVariant(section.colorVariant, visualPreset, section.sectionType, section.key);
  switch (section.sectionType) {
    case "hero-1":
      return toHeroBlock(section, pageTitle, description, pagePath);
    case "problem-solution-block":
      return toProblemSolutionBlock(section, section.title, description, colorVariant);
    case "faq-block":
      return toFaqBlock(section, section.title, description, faqCategory, colorVariant);
    case "pricing-block":
      return toPricingBlock(section, section.title, description, faqCategory, colorVariant);
    case "testimonials-block":
      return toTestimonialsBlock(section, section.title, description, faqCategory, colorVariant);
    case "service-types-block":
      return toServiceTypesBlock(section, section.title, description, pagePath, colorVariant);
    case "split-row":
      return toSplitRowBlock(section, section.title, description, pagePath, colorVariant);
    case "timeline-row":
      return toTimelineRowBlock(section, section.title, description, colorVariant);
    case "cta-1":
      return toCtaBlock(section, section.title, description, pagePath, colorVariant);
    case "value-props-block":
    default:
      return toValuePropsBlock(section, section.title, description, colorVariant);
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
      template.visualPreset,
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
