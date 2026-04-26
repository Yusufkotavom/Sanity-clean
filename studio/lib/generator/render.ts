import { buildGeneratedPagePath, buildGeneratorSlug } from "./slug";
import { buildFaqCategory, buildGeneratorTokens, buildSectionPlan } from "./variation";
import type { BuildGeneratedPageDraftInput, GeneratedPageDraft, GeneratorSectionPlan, ReferenceValue } from "./types";

const toDisplayLabel = (value?: string) =>
  `${value || ""}`
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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

const buildPrimaryActionLabel = (offer?: string, service?: string) => {
  const offerLabel = toDisplayLabel(offer);
  if (offerLabel) {
    return `Minta ${offerLabel}`;
  }

  const serviceLabel = toDisplayLabel(service);
  return serviceLabel ? `Diskusikan ${serviceLabel}` : "Mulai Diskusi";
};

const buildSecondaryActionLabel = (visualPreset?: string) => {
  if (visualPreset === "pricing-spotlight") return "Lihat Scope";
  if (visualPreset === "proof-showcase") return "Lihat Bukti";
  if (visualPreset === "conversion-stack") return "Lihat Alur";
  if (visualPreset === "immersive-story") return "Lihat Narasi";
  if (visualPreset === "trust-matrix") return "Lihat Pembeda";
  if (visualPreset === "authority-canvas") return "Lihat Kredibilitas";
  if (visualPreset === "offer-funnel") return "Lihat Penawaran";
  if (visualPreset === "process-mosaic") return "Lihat Tahapan";
  return "Lihat Detail";
};

const buildServiceFeatureSet = (service?: string, angle?: string) => {
  const serviceLabel = toDisplayLabel(service) || "layanan";
  const angleLabel = toDisplayLabel(angle) || "intent utama";

  return [
    `${serviceLabel} dibingkai lebih jelas`,
    `Narasi tetap selaras dengan ${angleLabel}`,
    "Masih mudah dikoreksi manual",
  ];
};

const buildSplitHighlights = (service?: string, location?: string) => {
  const serviceLabel = toDisplayLabel(service) || "Layanan";
  const locationLabel = toDisplayLabel(location) || "target utama";

  return [
    {
      title: `${serviceLabel} lebih cepat dipahami`,
      body: `Layout ini memecah manfaat, pembeda, dan CTA supaya intent ${locationLabel} lebih mudah ditangkap.`,
      tags: ["Visual", "Clarity"],
    },
    {
      title: "Tetap fleksibel untuk banyak jasa",
      body: `Template menjaga struktur tetap stabil, lalu ${serviceLabel.toLowerCase()} dan konteks lokal mengisi detailnya.`,
      tags: ["Reusable", "Multi Service"],
    },
  ];
};

const buildTimelineSteps = (service?: string, offer?: string, angle?: string) => {
  const serviceLabel = toDisplayLabel(service) || "layanan";
  const offerLabel = toDisplayLabel(offer) || "diskusi awal";
  const angleLabel = toDisplayLabel(angle) || "intent utama";

  return [
    {
      title: "Pilih sudut intent",
      tagLine: "Step 1",
      body: `Keyword dipetakan ke angle ${angleLabel.toLowerCase()} agar ${serviceLabel.toLowerCase()} tidak terasa generik.`,
    },
    {
      title: "Susun ritme section",
      tagLine: "Step 2",
      body: `Section visual dipilih untuk membawa visitor dari masalah ke ${offerLabel.toLowerCase()} secara lebih runtut.`,
    },
    {
      title: "Tutup dengan CTA jelas",
      tagLine: "Step 3",
      body: `Output tetap berupa page biasa sehingga editor masih bisa memoles copy ${serviceLabel.toLowerCase()} sebelum publish.`,
    },
  ];
};

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

  if (preset === "immersive-story") {
    if (sectionType === "split-row") return "accent";
    if (sectionType === "timeline-row") return "card";
    if (sectionType === "cta-1") return "primary";
    return sectionKey === "highlights" ? "secondary" : "background";
  }

  if (preset === "trust-matrix") {
    if (sectionType === "testimonials-block") return "secondary";
    if (sectionType === "value-props-block") return "accent";
    if (sectionType === "pricing-block") return "muted";
    return sectionKey === "finalCta" ? "primary" : "background";
  }

  if (preset === "authority-canvas") {
    if (sectionType === "testimonials-block") return "accent";
    if (sectionType === "split-row") return "secondary";
    if (sectionType === "cta-1") return "primary";
    return sectionKey === "highlights" ? "card" : "background";
  }

  if (preset === "offer-funnel") {
    if (sectionType === "pricing-block") return "primary";
    if (sectionType === "service-types-block") return "accent";
    if (sectionType === "cta-1") return "primary";
    return sectionType === "faq-block" ? "muted" : "background";
  }

  if (preset === "process-mosaic") {
    if (sectionType === "timeline-row") return "accent";
    if (sectionType === "split-row") return "card";
    if (sectionType === "service-types-block") return "secondary";
    return sectionKey === "finalCta" ? "primary" : "background";
  }

  if (sectionType === "service-types-block") return "card";
  if (sectionType === "testimonials-block") return "muted";
  if (sectionType === "pricing-block") return "secondary";
  return sectionKey === "highlights" ? "accent" : "background";
};

const toHeroBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  primaryActionLabel: string,
  secondaryActionLabel: string,
) => ({
  _type: "hero-1",
  _key: section.key,
  tagLine: section.title,
  title,
  body: buildPortableText(description, section.key),
  links: [
    buildLink(`${section.key}-link-primary`, primaryActionLabel, pagePath),
    buildLink(`${section.key}-link-secondary`, secondaryActionLabel, pagePath, "outline"),
  ],
});

const toStatsHeroBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  colorVariant: string,
  primaryActionLabel: string,
  secondaryActionLabel: string,
  location?: string,
) => ({
  _type: "stats-hero-block",
  _key: section.key,
  colorVariant,
  padding: DEFAULT_PADDING,
  eyebrow: location ? `Fokus ${toDisplayLabel(location)}` : "Fokus Intent Utama",
  title,
  description,
  links: [
    buildLink(`${section.key}-stats-primary`, primaryActionLabel, pagePath),
    buildLink(`${section.key}-stats-secondary`, secondaryActionLabel, pagePath, "outline"),
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
      description: `Draft ini menjaga arah ${section.key.replace(/-/g, " ")} tetap konsisten tanpa membuat halaman terasa copy-paste.`,
    },
    {
      _key: `${section.key}-value-3`,
      icon: "03",
      title: "Masih mudah disunting manual",
      description: "Output tetap berupa page biasa sehingga editor masih bisa merapikan copy akhir tanpa mengulang generator.",
    },
  ],
});

const toBenefitsBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
  service?: string,
  angle?: string,
) => ({
  _type: "benefits-block",
  _key: section.key,
  title,
  subtitle: `Kenapa ${toDisplayLabel(service) || "layanan ini"} lebih mudah dipilih`,
  description,
  colorVariant,
  padding: DEFAULT_PADDING,
  benefits: [
    {
      _key: `${section.key}-benefit-1`,
      icon: "🚀",
      title: `${toDisplayLabel(service) || "Layanan"} lebih mudah ditemukan`,
      description: `Halaman dibentuk agar intent ${toDisplayLabel(angle) || "utama"} lebih cepat tertangkap visitor.`,
      badge: "Intent Lebih Jelas",
      badgeIcon: "✨",
    },
    {
      _key: `${section.key}-benefit-2`,
      icon: "🧭",
      title: "Alur keputusan lebih rapi",
      description: "Struktur visual membawa visitor dari masalah, pembeda, sampai CTA tanpa terasa acak.",
      badge: "Flow Lebih Terarah",
      badgeIcon: "📍",
    },
    {
      _key: `${section.key}-benefit-3`,
      icon: "🤝",
      title: "Masih mudah dipoles manual",
      description: "Output tetap berupa page biasa sehingga tim tetap bisa menyesuaikan copy akhir sesuai kebutuhan.",
      badge: "Editable",
      badgeIcon: "🛠️",
    },
  ],
});

const toFeaturesPackageBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
  service?: string,
  offer?: string,
) => ({
  _type: "features-package-block",
  _key: section.key,
  title,
  subtitle: `Yang didapat dari ${toDisplayLabel(offer) || "langkah awal ini"}`,
  description,
  colorVariant,
  padding: DEFAULT_PADDING,
  features: [
    {
      _key: `${section.key}-feature-1`,
      icon: "🧩",
      title: `${toDisplayLabel(service) || "Layanan"} dibingkai lebih strategis`,
      description: "Struktur section dipilih agar pesan utama tidak tenggelam di paragraf yang terlalu panjang.",
      badge: "Positioning",
    },
    {
      _key: `${section.key}-feature-2`,
      icon: "📦",
      title: "CTA dan scope lebih terbaca",
      description: "Visitor bisa melihat langkah lanjut dan nilai offer dengan lebih cepat.",
      badge: "Offer Clarity",
    },
    {
      _key: `${section.key}-feature-3`,
      icon: "🎯",
      title: "Siap dijadikan dasar iterasi",
      description: "Template bisa dipakai ulang untuk banyak jasa sambil tetap menjaga kesatuan bahasa desain.",
      badge: "Reusable",
    },
  ],
});

const toCompanyInfoBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  colorVariant: string,
) => ({
  _type: "company-info",
  _key: section.key,
  title,
  description,
  colorVariant,
  padding: DEFAULT_PADDING,
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
  service?: string,
  angle?: string,
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
      features: buildServiceFeatureSet(service, angle),
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
  service?: string,
  location?: string,
  primaryActionLabel?: string,
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
      link: buildLink(`${section.key}-link-primary`, primaryActionLabel || "Diskusikan Struktur Halaman", pagePath),
    },
    {
      _key: `${section.key}-proofs`,
      _type: "split-info-list",
      list: buildSplitHighlights(service, location).map((item, index) => ({
        _key: `${section.key}-proof-${index + 1}`,
        _type: "split-info",
        title: item.title,
        body: buildPortableText(item.body, `${section.key}-proof-${index + 1}`),
        tags: item.tags,
      })),
    },
  ],
});

const toTimelineRowBlock = (
  section: GeneratorSectionPlan,
  colorVariant: string,
  service?: string,
  offer?: string,
  angle?: string,
) => ({
  _type: "timeline-row",
  _key: section.key,
  colorVariant,
  padding: DEFAULT_PADDING,
  timelines: buildTimelineSteps(service, offer, angle).map((item, index) => ({
    _key: `${section.key}-timeline-${index + 1}`,
    _type: "timelines-1",
    title: item.title,
    tagLine: item.tagLine,
    body: buildPortableText(item.body, `${section.key}-timeline-${index + 1}`),
  })),
});

const toCtaBlock = (
  section: GeneratorSectionPlan,
  title: string,
  description: string,
  pagePath: string,
  colorVariant: string,
  primaryActionLabel: string,
  secondaryActionLabel: string,
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
    buildLink(`${section.key}-cta-primary`, primaryActionLabel, pagePath),
    buildLink(`${section.key}-cta-secondary`, secondaryActionLabel, pagePath, "outline"),
  ],
});

const sectionPlanToBlock = (
  section: GeneratorSectionPlan,
  pageTitle: string,
  description: string,
  pagePath: string,
  faqCategory: string,
  visualPreset: string | undefined,
  service?: string,
  location?: string,
  offer?: string,
  angle?: string,
) => {
  const colorVariant = resolveSectionColorVariant(section.colorVariant, visualPreset, section.sectionType, section.key);
  const primaryActionLabel = buildPrimaryActionLabel(offer, service);
  const secondaryActionLabel = buildSecondaryActionLabel(visualPreset);
  switch (section.sectionType) {
    case "hero-1":
      return toHeroBlock(section, pageTitle, description, pagePath, primaryActionLabel, secondaryActionLabel);
    case "stats-hero-block":
      return toStatsHeroBlock(section, pageTitle, description, pagePath, colorVariant, primaryActionLabel, secondaryActionLabel, location);
    case "problem-solution-block":
      return toProblemSolutionBlock(section, section.title, description, colorVariant);
    case "benefits-block":
      return toBenefitsBlock(section, section.title, description, colorVariant, service, angle);
    case "features-package-block":
      return toFeaturesPackageBlock(section, section.title, description, colorVariant, service, offer);
    case "company-info":
      return toCompanyInfoBlock(section, section.title, description, colorVariant);
    case "faq-block":
      return toFaqBlock(section, section.title, description, faqCategory, colorVariant);
    case "pricing-block":
      return toPricingBlock(section, section.title, description, faqCategory, colorVariant);
    case "testimonials-block":
      return toTestimonialsBlock(section, section.title, description, faqCategory, colorVariant);
    case "service-types-block":
      return toServiceTypesBlock(section, section.title, description, pagePath, colorVariant, service, angle);
    case "split-row":
      return toSplitRowBlock(section, section.title, description, pagePath, colorVariant, service, location, primaryActionLabel);
    case "timeline-row":
      return toTimelineRowBlock(section, colorVariant, service, offer, angle);
    case "cta-1":
      return toCtaBlock(section, section.title, description, pagePath, colorVariant, primaryActionLabel, secondaryActionLabel);
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
  const service = tokens.service ?? row.service ?? keywordSet.primaryKeyword;
  const angle = tokens.angle ?? keywordSet.angle;
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

  const blocks = sectionPlan.map((section) =>
    sectionPlanToBlock(
      section,
      seoTitlePattern ? `${pageTitle} | ${seoTitlePattern}` : pageTitle,
      `${description} ${section.copy}`.trim(),
      pagePath,
      buildFaqCategory(template, row),
      template.visualPreset,
      service,
      location,
      offer,
      angle,
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
