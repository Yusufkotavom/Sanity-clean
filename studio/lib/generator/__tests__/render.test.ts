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
    visualPreset: "editorial-grid",
    tokenDefinitions: [
      { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
      { name: "service", sourceField: "service", required: true },
      { name: "city", sourceField: "city" },
      { name: "location", sourceField: "location", required: true },
      { name: "offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
    ],
    blocks: [
      {
        _type: "hero-1",
        _key: "hero",
        tagLine: "{{primaryKeyword}}",
        title: "{{service}} di {{city}}",
        body: [
          {
            _key: "hero-block",
            _type: "block",
            style: "normal",
            markDefs: [],
            children: [
              {
                _key: "hero-span",
                _type: "span",
                marks: [],
                text: "{{offer}} untuk {{location}}",
              },
            ],
          },
        ],
        links: [
          {
            _key: "hero-link",
            _type: "link",
            isExternal: true,
            title: "Mulai",
            href: "{{pagePath}}",
          },
        ],
      },
      {
        _type: "cta-1",
        _key: "final-cta",
        title: "Konsultasi {{service}}",
        body: [
          {
            _key: "cta-block",
            _type: "block",
            style: "normal",
            markDefs: [],
            children: [
              {
                _key: "cta-span",
                _type: "span",
                marks: [],
                text: "Keyword: {{primaryKeyword}}",
              },
            ],
          },
        ],
        links: [
          {
            _key: "cta-link",
            _type: "link",
            isExternal: true,
            title: "Lihat",
            href: "{{pagePath}}",
          },
        ],
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

test("buildGeneratedPageDraft builds a page draft and keeps lineage metadata", () => {
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
  assert.equal(result.generator.version, "v3");
  assert.equal(result.generator.aiUsed, false);
  assert.equal(result.topBlockCount, 0);
});

test("buildGeneratedPageDraft replaces tokens in nested block fields", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    keywordSet: { _key: "kw-2", key: "kw-printing-2", primaryKeyword: "cetak buku cepat" },
  });

  const hero = result.blocks[0] as {
    tagLine: string;
    title: string;
    body: Array<{ children: Array<{ text: string }> }>;
    links: Array<{ href: string }>;
  };

  assert.equal(hero.tagLine, "cetak buku cepat");
  assert.equal(hero.title, "cetak-buku di surabaya");
  assert.equal(hero.body[0]?.children[0]?.text, "estimasi cepat untuk surabaya");
  assert.equal(hero.links[0]?.href, `/${result.slug.current}`);

  const cta = result.blocks[1] as {
    title: string;
    body: Array<{ children: Array<{ text: string }> }>;
  };
  assert.equal(cta.title, "Konsultasi cetak-buku");
  assert.equal(cta.body[0]?.children[0]?.text, "Keyword: cetak buku cepat");
});

test("buildGeneratedPageDraft handles missing template blocks with empty output", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    template: {
      ...baseInput.template,
      blocks: [],
    },
    keywordSet: { _key: "kw-3", primaryKeyword: "cetak buku online" },
  });

  assert.deepEqual(result.blocks, []);
});


test("buildGeneratedPageDraft supports custom slug pattern from program", () => {
  const result = buildGeneratedPageDraft({
    ...baseInput,
    program: {
      ...baseInput.program,
      slugPattern: "{{routeBase}}/{{city}}/{{service}}",
    },
    keywordSet: { _key: "kw-4", primaryKeyword: "jasa cetak buku" },
  });

  assert.equal(result.slug.current, "percetakan/surabaya/cetak-buku");
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

  assert.equal(detectDuplicateSlug(existing, "percetakan-cetak-buku-surabaya-jasa-cetak-buku"), true);

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
