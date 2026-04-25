import { createSanityReadClient, createSanityWriteClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const WRITE_MODE = process.argv.includes("--write");

const PAGE_TEMPLATES_QUERY = `*[_type == "pageTemplate"] | order(lane asc, title asc){
  _id,
  title,
  lane,
  variant,
  "slug": slug.current,
  shellId,
  topBlockCountDefault
}`;

const STANDARD_TOKENS = [
  { _key: "token-primary-keyword", name: "primaryKeyword", label: "Primary Keyword", sourceField: "primaryKeyword", required: true },
  { _key: "token-service", name: "service", label: "Service", sourceField: "service", required: true },
  { _key: "token-city", name: "city", label: "City", sourceField: "city" },
  { _key: "token-location", name: "location", label: "Location", sourceField: "location", fallbackValue: "indonesia", required: true },
  { _key: "token-offer", name: "offer", label: "Offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
  { _key: "token-industry", name: "industry", label: "Industry", sourceField: "industry", fallbackValue: "bisnis lokal" },
  { _key: "token-angle", name: "angle", label: "Angle", sourceField: "angle", fallbackValue: "default", required: true },
];

function normalizeDesignFamily(lane) {
  const value = `${lane || ""}`.trim().toLowerCase();
  return ["website", "software", "printing", "generic"].includes(value) ? value : "generic";
}

function normalizeTopBlockCount(value) {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

function slugify(value) {
  return `${value || ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildId(source) {
  const stable = slugify(source.slug || source.title || source._id || "legacy-template");
  return `generator-template-legacy-${stable || "template"}`;
}

function buildSections(seed) {
  switch (seed.designFamily) {
    case "website":
      return {
        baseSections: ["hero", "benefits", "proof"],
        optionalSections: ["services", "faq", "cta"],
      };
    case "software":
      return {
        baseSections: ["hero", "benefits", "process"],
        optionalSections: ["proof", "faq", "cta"],
      };
    case "printing":
      return {
        baseSections: ["hero", "benefits", "pricing"],
        optionalSections: ["proof", "faq", "cta"],
      };
    default:
      return {
        baseSections: ["hero", "benefits"],
        optionalSections: ["proof", "faq", "cta"],
      };
  }
}

function buildSectionVariants(seed) {
  return [
    {
      _key: "section-hero",
      key: "hero",
      title: "{{primaryKeyword}} untuk {{location}}",
      sectionType: "hero-1",
      copy: "{{offer}} untuk kebutuhan {{service}} yang tetap selaras dengan intent {{primaryKeyword}}.",
      requiredTokens: ["primaryKeyword", "location", "offer"],
    },
    {
      _key: "section-benefits",
      key: "benefits",
      title: `Keunggulan ${seed.title}`,
      sectionType: "value-props-block",
      copy: "Fokus pada manfaat inti untuk {{industry}} dengan angle {{angle}}.",
      requiredTokens: ["industry", "angle"],
    },
    {
      _key: "section-pricing",
      key: "pricing",
      title: "Porsi solusi untuk {{service}}",
      sectionType: "pricing-block",
      copy: "Gunakan struktur penawaran yang relevan untuk {{location}}.",
      requiredTokens: ["service", "location"],
      optional: seed.designFamily !== "printing",
    },
    {
      _key: "section-process",
      key: "process",
      title: "Alur kerja {{service}}",
      sectionType: "process-block",
      copy: "Jelaskan tahapan yang paling penting agar {{offer}} terasa konkret.",
      requiredTokens: ["service", "offer"],
      optional: seed.designFamily !== "software",
    },
    {
      _key: "section-proof",
      key: "proof",
      title: "Bukti kerja untuk {{location}}",
      sectionType: "proof-block",
      copy: "Gunakan proof yang mendukung intent {{primaryKeyword}} tanpa duplikasi copy.",
      requiredTokens: ["location", "primaryKeyword"],
      optional: false,
    },
    {
      _key: "section-services",
      key: "services",
      title: "Ruang lingkup {{service}}",
      sectionType: "services-block",
      copy: "Pecah ruang lingkup sesuai kebutuhan {{industry}}.",
      requiredTokens: ["service", "industry"],
      optional: true,
    },
    {
      _key: "section-faq",
      key: "faq",
      title: "FAQ {{primaryKeyword}}",
      sectionType: "faq-block",
      copy: "Jawaban harus selaras dengan route dan tidak hanya mengulang keyword.",
      requiredTokens: ["primaryKeyword"],
      optional: true,
    },
    {
      _key: "section-cta",
      key: "cta",
      title: "Langkah berikutnya untuk {{location}}",
      sectionType: "cta-1",
      copy: "Arahkan ke {{offer}} yang paling masuk akal untuk {{service}}.",
      requiredTokens: ["location", "offer", "service"],
      optional: true,
    },
  ];
}

function mapLegacyTemplateToSeed(legacy = {}) {
  return {
    title: legacy.title?.trim() || "Migrated Legacy Template",
    designFamily: normalizeDesignFamily(legacy.lane),
    shellId: legacy.shellId?.trim() || null,
    topBlockCount: normalizeTopBlockCount(legacy.topBlockCountDefault),
    source: {
      legacyId: legacy._id?.trim() || null,
      legacySlug: legacy.slug?.trim() || null,
      legacyVariant: legacy.variant?.trim() || null,
    },
  };
}

function buildGeneratorTemplateDoc(legacy) {
  const seed = mapLegacyTemplateToSeed(legacy);
  const sections = buildSections(seed);
  const id = buildId(legacy);
  const slug = slugify(legacy.slug || legacy.title || id);
  const sourceParts = [
    seed.source.legacyId ? `legacyId=${seed.source.legacyId}` : null,
    seed.source.legacySlug ? `legacySlug=${seed.source.legacySlug}` : null,
    seed.source.legacyVariant ? `legacyVariant=${seed.source.legacyVariant}` : null,
    seed.shellId ? `shellId=${seed.shellId}` : null,
    `topBlockCount=${seed.topBlockCount}`,
  ].filter(Boolean);

  return {
    _id: id,
    _type: "generatorTemplate",
    title: `${seed.title} Migration`,
    slug: { _type: "slug", current: slug || id },
    description: `Migrated from legacy pageTemplate. ${sourceParts.join(" · ")}`,
    outputType: "page",
    designFamily: seed.designFamily,
    baseSections: sections.baseSections,
    optionalSections: sections.optionalSections,
    variationRules: ["angle-selects-optional-sections", "legacy-template-migration"],
    tokenDefinitions: STANDARD_TOKENS,
    sectionVariants: buildSectionVariants(seed),
    status: "draft",
    devOnly: true,
  };
}

async function main() {
  const env = await loadSanityEnv();
  const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim().toLowerCase();
  const tokenSource = env.SANITY_DEV ? "SANITY_DEV" : env.SANITY_AUTH_TOKEN ? "SANITY_AUTH_TOKEN" : null;

  if (dataset !== "development") {
    throw new Error(`Legacy template migration is development-only. Received dataset: ${dataset || "<empty>"}.`);
  }

  if (WRITE_MODE && !tokenSource) {
    throw new Error("Missing Sanity write token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  }

  const readClient = await createSanityReadClient();
  const legacyTemplates = await readClient.fetch(PAGE_TEMPLATES_QUERY);
  const docs = legacyTemplates.map(buildGeneratorTemplateDoc);

  const result = {
    ok: true,
    writeMode: WRITE_MODE,
    dataset,
    tokenSource,
    totalLegacyTemplates: legacyTemplates.length,
    generatedTemplateIds: docs.map((doc) => doc._id),
  };

  if (WRITE_MODE) {
    const writeClient = await createSanityWriteClient();
    for (const doc of docs) {
      await writeClient.createOrReplace(doc);
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
