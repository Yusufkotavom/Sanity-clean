import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createSanityWriteClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

if (!process.env.GENERATOR_SAMPLE_NODE_BOOTSTRAPPED) {
  const tsxLoaderPath = fileURLToPath(
    new URL("../../node_modules/tsx/dist/loader.mjs", import.meta.url),
  );
  const rerun = spawnSync(
    process.execPath,
    [
      "--experimental-specifier-resolution=node",
      "--import",
      tsxLoaderPath,
      fileURLToPath(import.meta.url),
      ...process.argv.slice(2),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        GENERATOR_SAMPLE_NODE_BOOTSTRAPPED: "1",
      },
      stdio: "inherit",
    },
  );

  process.exit(rerun.status ?? 1);
}

const { buildGeneratedPageDraft } = await import("../../../studio/lib/generator/render.ts");
const { findDuplicatePage } = await import("../../../studio/lib/generator/dedupe.ts");
const {
  assertGeneratorWriteTarget,
  buildGeneratedDraftId,
} = await import("../../../studio/lib/generator/write.ts");

const WRITE_MODE = process.argv.includes("--write");
const GENERATE_PAGES = process.argv.includes("--generate-pages");

const ROUTE_BASE = "/sample-generator";
const TEMPLATE_ID = "generator-template-finished-sample-dev";
const DATASET_ID = "generator-dataset-finished-sample-dev";
const PROGRAM_ID = "generator-program-finished-sample-dev";
const SAMPLE_PAGE_PREFIX = "sample-generator-";

const TOKEN_DEFINITIONS = [
  { _key: "token-primary-keyword", name: "primaryKeyword", label: "Primary Keyword", sourceField: "primaryKeyword", required: true },
  { _key: "token-service", name: "service", label: "Service", sourceField: "service", required: true },
  { _key: "token-city", name: "city", label: "City", sourceField: "city", required: true },
  { _key: "token-location", name: "location", label: "Location", sourceField: "city", required: true },
  { _key: "token-offer", name: "offer", label: "Offer", sourceField: "offer", fallbackValue: "konsultasi kebutuhan", required: true },
  { _key: "token-industry", name: "industry", label: "Industry", sourceField: "industry", fallbackValue: "bisnis lokal", required: true },
  { _key: "token-angle", name: "angle", label: "Angle", sourceField: "angle", fallbackValue: "conversion", required: true },
];

const SAMPLE_TEMPLATE = {
  _id: TEMPLATE_ID,
  _type: "generatorTemplate",
  title: "Finished Sample Visual Stack",
  slug: { _type: "slug", current: "finished-sample-visual-stack" },
  description:
    "Template sample jadi untuk menguji generator multi-jasa dengan ritme visual yang padat dan reusable.",
  designFamily: "multi-service",
  visualPreset: "conversion-stack",
  motionPreset: "crisp-snap",
  styleNotes:
    "Gunakan sebagai sample utama saat menguji family jasa berbeda dengan desain yang tetap selaras.",
  outputType: "page",
  tokenDefinitions: TOKEN_DEFINITIONS,
  blocks: [
    {
      _type: "hero-1",
      _key: "sample-hero",
      tagLine: "{{primaryKeyword}}",
      title: "{{service}} untuk {{industry}} di {{city}}",
      body: [
        {
          _key: "sample-hero-body",
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _key: "sample-hero-span",
              _type: "span",
              marks: [],
              text: "Buka dengan manfaat komersial yang jelas, lalu dorong visitor langsung ke {{offer}}.",
            },
          ],
        },
      ],
      links: [
        {
          _key: "sample-hero-link",
          _type: "link",
          isExternal: true,
          title: "Mulai",
          href: "{{pagePath}}",
        },
      ],
    },
    {
      _type: "value-props-block",
      _key: "sample-highlights",
      title: "Outcome utama dari {{service}}",
      description: "Sorot hasil, kejelasan proses, dan alasan memilih {{service}}.",
      colorVariant: "card",
      valueProps: [
        {
          _key: "sample-value-1",
          icon: "01",
          title: "Intent {{primaryKeyword}} lebih jelas",
          description: "Konten dibuat spesifik untuk {{city}}.",
        },
      ],
    },
    {
      _type: "cta-1",
      _key: "sample-final-cta",
      tagLine: "Final CTA",
      title: "Mulai {{offer}} sekarang",
      body: [
        {
          _key: "sample-cta-body",
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _key: "sample-cta-span",
              _type: "span",
              marks: [],
              text: "Tutup dengan CTA yang jelas dan tetap satu bahasa desain.",
            },
          ],
        },
      ],
      links: [
        {
          _key: "sample-cta-link",
          _type: "link",
          isExternal: true,
          title: "Diskusikan",
          href: "{{pagePath}}",
          buttonVariant: "default",
        },
      ],
    },
  ],
  status: "ready",
  devOnly: true,
};

const SAMPLE_DATASET = {
  _id: DATASET_ID,
  _type: "generatorDataset",
  title: "Finished Sample Dataset",
  slug: { _type: "slug", current: "finished-sample-dataset" },
  keywordSets: [
    {
      _key: "kw-web-conversion",
      key: "kw-web-conversion",
      label: "Website Conversion",
      primaryKeyword: "jasa pembuatan website conversion",
      secondaryKeywords: ["website landing page", "website bisnis konversi"],
      angle: "conversion",
    },
    {
      _key: "kw-software-ops",
      key: "kw-software-ops",
      label: "Software Operations",
      primaryKeyword: "jasa pembuatan software custom",
      secondaryKeywords: ["software operasional bisnis", "developer software custom"],
      angle: "operations",
    },
    {
      _key: "kw-print-premium",
      key: "kw-print-premium",
      label: "Printing Premium",
      primaryKeyword: "jasa cetak buku premium",
      secondaryKeywords: ["percetakan buku premium", "cetak buku berkualitas"],
      angle: "quality",
    },
  ],
  rows: [
    {
      _key: "row-jakarta-website",
      key: "row-jakarta-website",
      label: "Jakarta - Website",
      service: "pembuatan website",
      city: "jakarta",
      industry: "bisnis jasa",
      offer: "audit struktur halaman",
    },
    {
      _key: "row-surabaya-software",
      key: "row-surabaya-software",
      label: "Surabaya - Software",
      service: "software custom",
      city: "surabaya",
      industry: "operasional bisnis",
      offer: "review alur kerja",
    },
    {
      _key: "row-bandung-printing",
      key: "row-bandung-printing",
      label: "Bandung - Printing",
      service: "percetakan buku",
      city: "bandung",
      industry: "brand lokal",
      offer: "konsultasi bahan dan finishing",
    },
  ],
  importMode: "manual",
  dedupePolicy: "skip-existing-slug",
  status: "ready",
  devOnly: true,
};

const SAMPLE_PROGRAM = {
  _id: PROGRAM_ID,
  _type: "generatorProgram",
  title: "Finished Sample Program",
  slug: { _type: "slug", current: "finished-sample-program" },
  template: { _type: "reference", _ref: TEMPLATE_ID },
  dataset: { _type: "reference", _ref: DATASET_ID },
  programType: "landing-pages",
  generationMode: "batch",
  routeBase: ROUTE_BASE,
  slugPattern: "{{routeBase}}/{{city}}/{{service}}",
  defaultSeoPattern: {
    title: "Sample Generator",
    description:
      "Sample generator page untuk menguji output multi-jasa dengan desain reusable di dataset development.",
  },
  status: "ready",
  aiMode: "prepared",
  devOnly: true,
};

const EXISTING_PAGES_QUERY = `*[_type == "page" && !(_id in path("versions.**"))]{
  _id,
  title,
  slug,
  generator{programId, datasetId, rowKey, keywordKey}
}`;

const SAMPLE_PROGRAM_PAGES_QUERY = `*[
  _type == "page"
  && (
    slug.current match "${SAMPLE_PAGE_PREFIX}*"
    || generator.programId == $programId
  )
]{
  _id
}`;

const SAMPLE_MATCHES = [
  { keywordKey: "kw-web-conversion", rowKey: "row-jakarta-website" },
  { keywordKey: "kw-software-ops", rowKey: "row-surabaya-software" },
  { keywordKey: "kw-print-premium", rowKey: "row-bandung-printing" },
];

function buildProgramInput() {
  return {
    _id: SAMPLE_PROGRAM._id,
    title: SAMPLE_PROGRAM.title,
    slug: SAMPLE_PROGRAM.slug,
    routeBase: SAMPLE_PROGRAM.routeBase,
    slugPattern: SAMPLE_PROGRAM.slugPattern,
    ref: { _type: "reference", _ref: SAMPLE_PROGRAM._id },
    dataset: {
      _id: SAMPLE_DATASET._id,
      title: SAMPLE_DATASET.title,
      slug: SAMPLE_DATASET.slug,
      ref: { _type: "reference", _ref: SAMPLE_DATASET._id },
    },
    defaultSeoPattern: SAMPLE_PROGRAM.defaultSeoPattern,
  };
}

function buildTemplateInput() {
  return {
    ...SAMPLE_TEMPLATE,
    ref: { _type: "reference", _ref: SAMPLE_TEMPLATE._id },
  };
}

async function main() {
  const env = await loadSanityEnv();
  const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim();
  const tokenSource = env.SANITY_DEV ? "SANITY_DEV" : env.SANITY_AUTH_TOKEN ? "SANITY_AUTH_TOKEN" : null;

  if (dataset !== "development") {
    throw new Error(
      `Generator sample setup is development-only. Expected NEXT_PUBLIC_SANITY_DATASET=development, received ${dataset || "<empty>"}.`,
    );
  }

  if (!tokenSource) {
    throw new Error("Missing Sanity write token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  }

  const docs = [SAMPLE_TEMPLATE, SAMPLE_DATASET, SAMPLE_PROGRAM];
  const generatedDrafts = [];
  const skippedDrafts = [];

  if (WRITE_MODE) {
    const client = await createSanityWriteClient();
    assertGeneratorWriteTarget(dataset);

    for (const doc of docs) {
      await client.createOrReplace(doc);
    }

    if (GENERATE_PAGES) {
      const oldSamplePages = (await client.fetch(SAMPLE_PROGRAM_PAGES_QUERY, {
        programId: PROGRAM_ID,
      })) || [];

      for (const item of oldSamplePages) {
        if (item?._id) {
          await client.delete(item._id);
        }
      }

      const existingPages = (await client.fetch(EXISTING_PAGES_QUERY)) || [];

      for (const match of SAMPLE_MATCHES) {
        const keywordSet = SAMPLE_DATASET.keywordSets.find((item) => item.key === match.keywordKey);
        const row = SAMPLE_DATASET.rows.find((item) => item.key === match.rowKey);

        if (!keywordSet || !row) {
          skippedDrafts.push({
            slug: null,
            reason: "missing-sample-input",
            existingId: null,
          });
          continue;
        }

        const draft = buildGeneratedPageDraft({
          program: buildProgramInput(),
          template: buildTemplateInput(),
          keywordSet,
          row,
          generatedAt: new Date().toISOString(),
        });

        const duplicate = findDuplicatePage(existingPages, {
          slug: draft.slug.current,
          programId: draft.generator.programId,
          rowKey: draft.generator.rowKey,
          keywordKey: draft.generator.keywordKey,
        });

        if (duplicate) {
          skippedDrafts.push({
            slug: draft.slug.current,
            reason: duplicate.reason,
            existingId: duplicate.existing?._id || null,
          });
          continue;
        }

        const draftId = buildGeneratedDraftId(draft.slug.current);
        await client.createIfNotExists({
          _id: draftId,
          ...draft,
        });

        existingPages.push({
          _id: draftId,
          title: draft.title,
          slug: draft.slug,
          generator: draft.generator,
        });

        generatedDrafts.push({
          id: draftId,
          slug: draft.slug.current,
          title: draft.title,
        });
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        writeMode: WRITE_MODE,
        generatePages: GENERATE_PAGES,
        dataset,
        tokenSource,
        routeBase: ROUTE_BASE,
        slugPattern: SAMPLE_PROGRAM.slugPattern,
  slugPattern: "{{routeBase}}/{{city}}/{{service}}",
        docs: docs.map((doc) => doc._id),
        generatedDrafts,
        skippedDrafts,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
