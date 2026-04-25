import test from "node:test";
import assert from "node:assert/strict";

import { buildGeneratedPageDraft } from "../render";
import { detectDuplicateSlug, findDuplicatePage } from "../dedupe";

const baseInput = {
  program: {
    _id: "gp-1",
    routeBase: "/percetakan",
    dataset: {
      _id: "gd-1",
    },
    defaultSeoPattern: {
      title: "Kotacom Printing",
      description: "Solusi cetak bisnis deterministik",
    },
  },
  template: {
    _id: "gt-1",
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
      {
        key: "differentiators",
        title: "Should never render",
        sectionType: "value-props-block",
        requiredTokens: ["service"],
        optional: true,
      },
    ],
  },
  row: {
    _key: "row-1",
    key: "row-surabaya",
    service: "cetak-buku",
    city: "surabaya",
    offer: "estimasi cepat",
  },
};

test("buildGeneratedPageDraft builds a page draft with root-slug page path and complete lineage metadata", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    keywordSet: { _key: "kw-1", key: "kw-printing", primaryKeyword: "jasa cetak buku" },
  });

  assert.equal(result._type, "page");
  assert.equal(result.slug.current, "percetakan-cetak-buku-surabaya-jasa-cetak-buku");
  assert.equal(result.generator.programId, "gp-1");
  assert.deepEqual(result.generator.program, { _type: "reference", _ref: "gp-1", _weak: true });
  assert.equal(result.generator.templateId, "gt-1");
  assert.deepEqual(result.generator.template, { _type: "reference", _ref: "gt-1", _weak: true });
  assert.equal(result.generator.datasetId, "gd-1");
  assert.deepEqual(result.generator.dataset, { _type: "reference", _ref: "gd-1", _weak: true });
  assert.equal(result.generator.rowKey, "row-surabaya");
  assert.equal(result.generator.keywordKey, "kw-printing");
  assert.equal(result.generator.aiUsed, false);
  assert.equal(result.topBlockCount, 0);
  assert.ok(Array.isArray(result.blocks));
  assert.equal((result.blocks[0] as { links: Array<{ href: string }> }).links[0].href, `/${result.slug.current}`);
  assert.equal((result.blocks[0] as { links: Array<{ href: string }> }).links[1].href, `/${result.slug.current}`);
});

test("buildGeneratedPageDraft keeps ordered sections and gates optional sections by angle", () => {
  const fast = buildGeneratedPageDraft({
    ...baseInput,
    keywordSet: {
      _key: "kw-fast",
      primaryKeyword: "cetak buku cepat",
      angle: "speed",
    },
  });

  const price = buildGeneratedPageDraft({
    ...baseInput,
    keywordSet: {
      _key: "kw-price",
      primaryKeyword: "cetak buku murah",
      angle: "price",
    },
  });

  assert.deepEqual(
    fast.blocks.map((block) => block._type),
    ["hero-1", "value-props-block", "problem-solution-block", "faq-block"],
  );
  assert.deepEqual(
    price.blocks.map((block) => block._type),
    ["hero-1", "value-props-block", "faq-block"],
  );
  assert.equal(price.blocks.some((block) => block._key === "differentiators"), false);
});

test("buildGeneratedPageDraft skips sections whose required tokens cannot be resolved", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    template: {
      ...baseInput.template,
      tokenDefinitions: [
        { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
        { name: "service", sourceField: "service", required: true },
      ],
      baseSections: ["hero"],
      optionalSections: ["problems", "faq"],
      sectionVariants: [
        {
          key: "hero",
          title: "{{primaryKeyword}}",
          sectionType: "hero-1",
          requiredTokens: ["primaryKeyword"],
        },
        {
          key: "problems",
          title: "Needs city",
          sectionType: "problem-solution-block",
          requiredTokens: ["city"],
          optional: true,
        },
        {
          key: "faq",
          title: "Needs service",
          sectionType: "faq-block",
          requiredTokens: ["service"],
          optional: true,
        },
      ],
    },
    row: {
      _key: "row-2",
      key: "row-no-city",
      service: "cetak-buku",
    },
    keywordSet: {
      _key: "kw-speed",
      key: "kw-speed",
      primaryKeyword: "cetak buku cepat",
      angle: "speed",
    },
  });

  assert.deepEqual(
    result.blocks.map((block) => block._key),
    ["hero", "faq"],
  );
});

test("duplicate helpers detect slug and lineage conflicts", () => {
  const existing = [
    {
      _id: "page-1",
      slug: { current: "percetakan-cetak-buku-surabaya-jasa-cetak-buku" },
      generator: {
        programId: "gp-1",
        rowKey: "row-surabaya",
        keywordKey: "kw-printing",
      },
    },
  ];

  assert.equal(
    detectDuplicateSlug(existing, "percetakan-cetak-buku-surabaya-jasa-cetak-buku"),
    true,
  );

  const duplicate = findDuplicatePage(existing, {
    slug: "different-slug",
    programId: "gp-1",
    rowKey: "row-surabaya",
    keywordKey: "kw-printing",
  });

  assert.deepEqual(duplicate, {
    reason: "lineage",
    existing: existing[0],
  });
});
