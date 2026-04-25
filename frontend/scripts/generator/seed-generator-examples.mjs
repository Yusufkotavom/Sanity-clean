import { createSanityWriteClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const env = await loadSanityEnv();
const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim().toLowerCase();
const tokenSource = env.SANITY_DEV ? "SANITY_DEV" : env.SANITY_AUTH_TOKEN ? "SANITY_AUTH_TOKEN" : null;

if (!tokenSource) {
  throw new Error("Missing Sanity write token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
}

if (dataset !== "development") {
  throw new Error(`Generator example seeding is development-only. Received dataset: ${dataset || "<empty>"}.`);
}

const client = await createSanityWriteClient();

const templateId = "generator-template-printing-dev";
const datasetId = "generator-dataset-printing-dev";
const programId = "generator-program-printing-dev";

const docs = [
  {
    _id: templateId,
    _type: "generatorTemplate",
    title: "Printing Base",
    slug: { _type: "slug", current: "printing-base" },
    description: "Development-only deterministic printing template.",
    designFamily: "printing",
    outputType: "page",
    tokenDefinitions: [
      { _key: "token-primary-keyword", name: "primaryKeyword", label: "Primary Keyword", sourceField: "primaryKeyword", required: true },
      { _key: "token-service", name: "service", label: "Service", sourceField: "service", required: true },
      { _key: "token-city", name: "city", label: "City", sourceField: "city" },
      { _key: "token-location", name: "location", label: "Location", sourceField: "location", fallbackValue: "surabaya", required: true },
      { _key: "token-offer", name: "offer", label: "Offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
      { _key: "token-industry", name: "industry", label: "Industry", sourceField: "industry", fallbackValue: "bisnis lokal" },
      { _key: "token-angle", name: "angle", label: "Angle", sourceField: "angle", fallbackValue: "default", required: true },
    ],
    baseSections: ["hero", "benefits"],
    optionalSections: ["problems", "faq"],
    variationRules: ["angle-selects-optional-sections"],
    sectionVariants: [
      {
        _key: "section-hero",
        key: "hero",
        title: "{{primaryKeyword}} untuk {{city}}",
        sectionType: "hero-1",
        copy: "{{offer}} untuk {{location}}",
        requiredTokens: ["primaryKeyword", "location"],
      },
      {
        _key: "section-benefits",
        key: "benefits",
        title: "Keunggulan {{service}}",
        sectionType: "value-props-block",
        copy: "Benefit untuk {{industry}}",
        requiredTokens: ["service", "industry"],
      },
      {
        _key: "section-problems",
        key: "problems",
        title: "Masalah {{city}}",
        sectionType: "problem-solution-block",
        copy: "Butuh proses {{offer}}",
        requiredTokens: ["city", "offer"],
        optional: true,
      },
      {
        _key: "section-faq",
        key: "faq",
        title: "FAQ {{service}}",
        sectionType: "faq-block",
        copy: "Pertanyaan umum {{primaryKeyword}}",
        requiredTokens: ["primaryKeyword"],
        optional: true,
      },
    ],
    status: "ready",
  },
  {
    _id: datasetId,
    _type: "generatorDataset",
    title: "Printing Seed Dataset",
    slug: { _type: "slug", current: "generator-dataset-printing-dev" },
    importMode: "manual",
    dedupePolicy: "skip-existing-slug",
    keywordSets: [
      {
        _key: "kw-printing-quality",
        key: "kw-printing-quality",
        label: "Printing Quality",
        primaryKeyword: "jasa cetak buku",
        secondaryKeywords: ["cetak buku surabaya", "percetakan buku cepat"],
        angle: "quality",
      },
      {
        _key: "kw-printing-speed",
        key: "kw-printing-speed",
        label: "Printing Speed",
        primaryKeyword: "cetak buku cepat",
        secondaryKeywords: ["percetakan express", "print buku cepat"],
        angle: "speed",
      },
    ],
    rows: [
      {
        _key: "row-surabaya",
        key: "row-surabaya",
        label: "Surabaya",
        service: "cetak-buku",
        city: "surabaya",
        industry: "bisnis lokal",
        offer: "estimasi cepat",
      },
      {
        _key: "row-sidoarjo",
        key: "row-sidoarjo",
        label: "Sidoarjo",
        service: "cetak-buku",
        city: "sidoarjo",
        industry: "bisnis lokal",
        offer: "konsultasi bahan",
      },
    ],
    status: "ready",
  },
  {
    _id: programId,
    _type: "generatorProgram",
    title: "Printing Seed Program",
    slug: { _type: "slug", current: "generator-program-printing-dev" },
    routeBase: "/percetakan",
    programType: "location-pages",
    generationMode: "batch",
    aiMode: "off",
    status: "ready",
    template: { _type: "reference", _ref: templateId },
    dataset: { _type: "reference", _ref: datasetId },
    defaultSeoPattern: {
      title: "Kotacom Printing",
      description: "Solusi cetak bisnis deterministik",
    },
  },
];

for (const doc of docs) {
  await client.createOrReplace(doc);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      dataset,
      tokenSource,
      upsertedIds: docs.map((doc) => doc._id),
    },
    null,
    2,
  ),
);
