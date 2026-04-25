import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  createSanityReadClientWithDraftAccess,
  loadSanityEnv,
  resolveSanityReadToken,
} from "../lib/sanity-page-guards.mjs";

if (!process.env.GENERATOR_SMOKE_NODE_BOOTSTRAPPED) {
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
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        GENERATOR_SMOKE_NODE_BOOTSTRAPPED: "1",
      },
      stdio: "inherit",
    },
  );

  process.exit(rerun.status ?? 1);
}

const { buildGeneratedPageDraft } = await import("../../../studio/lib/generator/render.ts");
const { findDuplicatePage } = await import("../../../studio/lib/generator/dedupe.ts");

const PROGRAM_QUERY = `*[_type == "generatorProgram"] | order(_updatedAt desc)[0]{
  _id,
  title,
  slug,
  routeBase,
  template,
  dataset,
  defaultSeoPattern
}`;

const TEMPLATE_QUERY = `*[_type == "generatorTemplate" && _id == $id][0]{
  _id,
  title,
  designFamily,
  tokenDefinitions[]{_key, name, label, sourceField, fallbackValue, required},
  baseSections,
  optionalSections,
  variationRules,
  sectionVariants[]{_key, key, title, sectionType, copy, requiredTokens, optional}
}`;

const DATASET_QUERY = `*[_type == "generatorDataset" && _id == $id][0]{
  _id,
  title,
  slug,
  dedupePolicy,
  keywordSets[]{_key, key, label, primaryKeyword, secondaryKeywords, angle},
  rows[]{_key, key, label, service, city, industry, offer}
}`;

const EXISTING_PAGES_QUERY = `*[_type == "page" && !(_id in path("versions.**"))]{
  _id,
  title,
  slug,
  generator{programId, datasetId, rowKey, keywordKey}
}`;

function requireDevelopmentDataset(env) {
  const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim();
  if (dataset !== "development") {
    throw new Error(`Generator smoke script is dev-only. Expected NEXT_PUBLIC_SANITY_DATASET=development, received ${dataset || "<empty>"}.`);
  }
  return dataset;
}

function assertPresent(value, message) {
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function buildFallbackContext() {
  return {
    source: "sample-fallback",
    warnings: ["No generatorProgram documents found in the development dataset. Using fixture-based dry run instead."],
    program: {
      _id: "generator-program-smoke",
      title: "Generator Smoke Program",
      slug: { _type: "slug", current: "generator-smoke" },
      routeBase: "/percetakan",
      defaultSeoPattern: {
        title: "Kotacom Printing",
        description: "Solusi cetak bisnis deterministik",
      },
    },
    template: {
      _id: "generator-template-smoke",
      title: "Printing",
      designFamily: "printing",
      tokenDefinitions: [
        { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
        { name: "service", sourceField: "service", required: true },
        { name: "city", sourceField: "city" },
        { name: "location", sourceField: "location", required: true },
        { name: "offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
        { name: "industry", sourceField: "industry", fallbackValue: "bisnis lokal" },
        { name: "angle", sourceField: "angle", fallbackValue: "default", required: true },
      ],
      baseSections: ["hero", "benefits"],
      optionalSections: ["problems", "faq"],
      variationRules: ["angle-selects-optional-sections"],
      sectionVariants: [
        {
          key: "hero",
          title: "{{primaryKeyword}} untuk {{city}}",
          sectionType: "hero-1",
          copy: "{{offer}} untuk {{location}}",
          requiredTokens: ["primaryKeyword", "location"],
        },
        {
          key: "benefits",
          title: "Keunggulan {{service}}",
          sectionType: "value-props-block",
          copy: "Benefit untuk {{industry}}",
          requiredTokens: ["service", "industry"],
        },
        {
          key: "problems",
          title: "Masalah {{city}}",
          sectionType: "problem-solution-block",
          copy: "Butuh proses {{offer}}",
          requiredTokens: ["city", "offer"],
          optional: true,
        },
        {
          key: "faq",
          title: "FAQ {{service}}",
          sectionType: "faq-block",
          copy: "Pertanyaan umum {{primaryKeyword}}",
          requiredTokens: ["primaryKeyword"],
          optional: true,
        },
      ],
    },
    dataset: {
      _id: "generator-dataset-smoke",
      title: "Generator Smoke Dataset",
      slug: { _type: "slug", current: "generator-smoke-dataset" },
      dedupePolicy: "skip-existing-slug",
      keywordSets: [
        { _key: "kw-printing", key: "kw-printing", label: "Printing Quality", primaryKeyword: "jasa cetak buku", angle: "quality" },
        { _key: "kw-speed", key: "kw-speed", label: "Printing Fast", primaryKeyword: "cetak buku cepat", angle: "speed" },
      ],
      rows: [
        { _key: "row-surabaya", key: "row-surabaya", label: "Surabaya", service: "cetak-buku", city: "surabaya", offer: "estimasi cepat", industry: "bisnis lokal" },
        { _key: "row-sidoarjo", key: "row-sidoarjo", label: "Sidoarjo", service: "cetak-buku", city: "sidoarjo", offer: "konsultasi bahan", industry: "bisnis lokal" },
      ],
    },
    existingPages: [],
  };
}

async function buildLiveContext(client) {
  const program = await client.fetch(PROGRAM_QUERY);
  if (!program) {
    return buildFallbackContext();
  }

  const templateId = assertPresent(program.template?._ref, "Latest generatorProgram is missing a template reference.");
  const datasetId = assertPresent(program.dataset?._ref, "Latest generatorProgram is missing a dataset reference.");

  const [template, dataset, existingPages] = await Promise.all([
    client.fetch(TEMPLATE_QUERY, { id: templateId }),
    client.fetch(DATASET_QUERY, { id: datasetId }),
    client.fetch(EXISTING_PAGES_QUERY),
  ]);

  return {
    source: "sanity-development",
    warnings: [],
    program: assertPresent(program, "Generator program could not be loaded."),
    template: assertPresent(template, `Generator template ${templateId} could not be loaded.`),
    dataset: assertPresent(dataset, `Generator dataset ${datasetId} could not be loaded.`),
    existingPages: existingPages ?? [],
  };
}

const env = await loadSanityEnv();
const datasetName = requireDevelopmentDataset(env);
const readToken = resolveSanityReadToken(env);
const client = await createSanityReadClientWithDraftAccess();
const context = await buildLiveContext(client);

const keywordSet = assertPresent(context.dataset.keywordSets?.[0], "Generator dataset has no keyword sets for dry-run preview.");
const row = assertPresent(context.dataset.rows?.[0], "Generator dataset has no rows for dry-run preview.");

const buildProgramInput = () => ({
  _id: context.program._id,
  title: context.program.title,
  slug: context.program.slug,
  routeBase: context.program.routeBase,
  ref: { _type: "reference", _ref: context.program._id },
  dataset: {
    _id: context.dataset._id,
    title: context.dataset.title,
    slug: context.dataset.slug,
    ref: { _type: "reference", _ref: context.dataset._id },
  },
  defaultSeoPattern: context.program.defaultSeoPattern,
});

const buildTemplateInput = () => ({
  ...context.template,
  ref: { _type: "reference", _ref: context.template._id },
});

const previewDraft = buildGeneratedPageDraft({
  program: buildProgramInput(),
  template: buildTemplateInput(),
  keywordSet,
  row,
});

let generated = 0;
let skipped = 0;
let conflicts = 0;
let failed = 0;
const duplicateSamples = [];
const failureSamples = [];
const combinations = [];

for (const currentKeywordSet of context.dataset.keywordSets ?? []) {
  for (const currentRow of context.dataset.rows ?? []) {
    combinations.push({ keywordSet: currentKeywordSet, row: currentRow });
  }
}

for (const combination of combinations) {
  try {
    const draft = buildGeneratedPageDraft({
      program: buildProgramInput(),
      template: buildTemplateInput(),
      keywordSet: combination.keywordSet,
      row: combination.row,
    });

    const duplicate = findDuplicatePage(context.existingPages ?? [], {
      slug: draft.slug.current,
      programId: draft.generator.programId,
      rowKey: draft.generator.rowKey,
      keywordKey: draft.generator.keywordKey,
    });

    if (duplicate) {
      if (context.dataset.dedupePolicy === "skip-existing-slug" && duplicate.reason === "slug") {
        skipped += 1;
      } else {
        conflicts += 1;
      }

      if (duplicateSamples.length < 3) {
        duplicateSamples.push({
          slug: draft.slug.current,
          reason: duplicate.reason,
          existingId: duplicate.existing?._id || null,
        });
      }
      continue;
    }

    generated += 1;
  } catch (error) {
    failed += 1;
    if (failureSamples.length < 3) {
      failureSamples.push(error instanceof Error ? error.message : "Unknown dry-run failure.");
    }
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      devOnly: true,
      dataset: datasetName,
      readPath: {
        auth: readToken ? "token-drafts" : "anonymous-published",
        preferredLiveDevDocs: Boolean(readToken),
      },
      source: context.source,
      warnings: context.warnings,
      program: {
        id: context.program._id,
        title: context.program.title || null,
        routeBase: context.program.routeBase,
      },
      preview: {
        keywordSet: keywordSet.label || keywordSet.key || keywordSet.primaryKeyword,
        row: row.label || row.key || row.service || null,
        slug: previewDraft.slug.current,
        title: previewDraft.title,
        blockCount: previewDraft.blocks.length,
      },
      dryRun: {
        combinationCount: combinations.length,
        generated,
        skipped,
        conflicts,
        failed,
        dedupePolicy: context.dataset.dedupePolicy || null,
        duplicateSamples,
        failureSamples,
      },
    },
    null,
    2,
  ),
);
