import test from "node:test";
import assert from "node:assert/strict";

import { buildGeneratedPageDraft } from "../render";
import { detectDuplicateSlug, findDuplicatePage } from "../dedupe";

const baseInput = {
  program: {
    _id: "gp-1",
    routeBase: "/percetakan",
    dataset: { _id: "gd-1" },
    defaultSeoPattern: {
      title: "Kotacom Printing",
      description: "Solusi cetak bisnis deterministik",
    },
  },
  template: {
    _id: "gt-1",
    title: "Printing",
    designFamily: "printing",
    visualPreset: "editorial-grid",
    routeBase: "/jasa-cetak-buku",
    slugPattern: "{{routeBase}}-{{city}}",
    seoMeta: {
      titlePattern: "{{primaryKeyword}} | Kotacom",
      descriptionPattern: "{{offer}}. {{localCondition}}",
      focusKeywordToken: "{{primaryKeyword}}",
      secondaryKeywordsSource: "secondaryKeywords",
    },
    tokenDefinitions: [
      { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
      { name: "service", sourceField: "service", required: true },
      { name: "city", sourceField: "city" },
      { name: "offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
      { name: "localCondition", sourceField: "localCondition" },
    ],
    blocks: [
      {
        _type: "hero-1",
        _key: "hero",
        tagLine: "{{primaryKeyword}}",
        title: "{{service}} di {{city}}",
        body: [
          {
            _key: "hero-block", _type: "block", style: "normal", markDefs: [],
            children: [{ _key: "hero-span", _type: "span", marks: [], text: "{{offer}} untuk {{city}}" }],
          },
        ],
        links: [{ _key: "hero-link", _type: "link", isExternal: true, title: "Mulai", href: "{{pagePath}}" }],
      },
      {
        _type: "cta-1",
        _key: "final-cta",
        title: "Konsultasi {{service}}",
        body: [
          {
            _key: "cta-block", _type: "block", style: "normal", markDefs: [],
            children: [{ _key: "cta-span", _type: "span", marks: [], text: "Keyword: {{primaryKeyword}}" }],
          },
        ],
        links: [{ _key: "cta-link", _type: "link", isExternal: true, title: "Lihat", href: "{{pagePath}}" }],
      },
    ],
  },
  row: {
    _key: "row-1",
    key: "row-surabaya",
    service: "cetak-buku",
    city: "surabaya",
    primaryKeyword: "jasa cetak buku surabaya",
    secondaryKeywords: ["percetakan surabaya", "cetak offset surabaya"],
    offer: "estimasi cepat",
    localCondition: "Kota terbesar kedua Indonesia",
  },
};

test("buildGeneratedPageDraft builds a page with lineage metadata", () => {
  const result = buildGeneratedPageDraft(baseInput);

  assert.equal(result._type, "page");
  assert.equal(result.slug.current, "jasa-cetak-buku-surabaya");
  assert.equal(result.generator.programId, "gp-1");
  assert.equal(result.generator.templateId, "gt-1");
  assert.equal(result.generator.datasetId, "gd-1");
  assert.equal(result.generator.rowKey, "row-surabaya");
  assert.equal(result.generator.keywordKey, "jasa cetak buku surabaya");
  assert.equal(result.generator.version, "v4");
  assert.equal(result.generator.aiUsed, false);
  assert.equal(result.topBlockCount, 0);
});

test("buildGeneratedPageDraft replaces tokens in nested block fields", () => {
  const result = buildGeneratedPageDraft(baseInput);

  const hero = result.blocks[0] as {
    tagLine: string; title: string;
    body: Array<{ children: Array<{ text: string }> }>;
    links: Array<{ href: string }>;
  };

  assert.equal(hero.tagLine, "jasa cetak buku surabaya");
  assert.equal(hero.title, "cetak-buku di surabaya");
  assert.equal(hero.body[0]?.children[0]?.text, "estimasi cepat untuk surabaya");
  assert.equal(hero.links[0]?.href, `/${result.slug.current}`);

  const cta = result.blocks[1] as { title: string; body: Array<{ children: Array<{ text: string }> }> };
  assert.equal(cta.title, "Konsultasi cetak-buku");
  assert.equal(cta.body[0]?.children[0]?.text, "Keyword: jasa cetak buku surabaya");
});

test("buildGeneratedPageDraft uses template seoMeta for meta fields", () => {
  const result = buildGeneratedPageDraft(baseInput);

  assert.equal(result.meta?.title, "jasa cetak buku surabaya | Kotacom");
  assert.equal(result.meta?.focusKeyword, "jasa cetak buku surabaya");
  assert.deepEqual(result.meta?.secondaryKeywords, ["percetakan surabaya", "cetak offset surabaya"]);
  assert.ok(result.meta?.description?.includes("estimasi cepat"));
});

test("buildGeneratedPageDraft uses template routeBase over program", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    program: { ...baseInput.program, routeBase: "/should-not-use-this" },
  });

  // Template routeBase takes priority
  assert.equal(result.slug.current, "jasa-cetak-buku-surabaya");
});

test("buildGeneratedPageDraft handles empty blocks", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    template: { ...baseInput.template, blocks: [] },
  });
  assert.deepEqual(result.blocks, []);
});

test("duplicate helpers detect slug and lineage conflicts", () => {
  const existing = [
    {
      _id: "page-1",
      slug: { current: "jasa-cetak-buku-surabaya" },
      generator: { programId: "gp-1", rowKey: "row-surabaya", keywordKey: "jasa cetak buku surabaya" },
    },
  ];

  assert.equal(detectDuplicateSlug(existing, "jasa-cetak-buku-surabaya"), true);

  const duplicate = findDuplicatePage(existing, {
    slug: "different-slug",
    programId: "gp-1",
    rowKey: "row-surabaya",
    keywordKey: "jasa cetak buku surabaya",
  });

  assert.deepEqual(duplicate, { reason: "lineage", existing: existing[0] });
});
