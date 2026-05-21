import test from "node:test";
import assert from "node:assert/strict";

import { buildGeneratedPageDraft } from "../render";
import { assessGeneratedDraftQuality } from "../qa";

const input = {
  program: {
    _id: "gp-1",
    routeBase: "/sample-generator",
    dataset: { _id: "gd-1" },
    defaultSeoPattern: {
      title: "Harga & Portofolio",
      description:
        "Jasa pembuatan website dengan landing page fokus conversion, CTA jelas, dan alur konten yang mudah disunting untuk bisnis lokal.",
    },
  },
  template: {
    _id: "gt-1",
    title: "Sample Template",
    designFamily: "multi-service",
    tokenDefinitions: [
      { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
      { name: "service", sourceField: "service", required: true },
      { name: "city", sourceField: "city", required: true },
      { name: "offer", sourceField: "offer", required: true },
    ],
    blocks: [
      {
        _type: "hero-1",
        _key: "hero",
        title: "{{primaryKeyword}} {{city}}",
        body: [
          {
            _key: "hero-body",
            _type: "block",
            style: "normal",
            markDefs: [],
            children: [
              {
                _key: "hero-span",
                _type: "span",
                marks: [],
                text: "Mulai {{offer}}",
              },
            ],
          },
        ],
      },
      {
        _type: "section-header",
        _key: "context",
        title: "Konteks {{city}}",
        description: "Fokus {{primaryKeyword}}",
      },
      {
        _type: "cta-1",
        _key: "final-cta",
        title: "Konsultasi {{service}}",
      },
    ],
  },
  keywordSet: {
    _key: "kw-web",
    key: "kw-web",
    primaryKeyword: "jasa pembuatan website conversion",
  },
  row: {
    _key: "row-jakarta",
    key: "row-jakarta",
    service: "pembuatan website",
    city: "jakarta",
    industry: "bisnis jasa",
    offer: "audit struktur halaman",
  },
};

test("assessGeneratedDraftQuality returns warning for a minimal but valid generated draft", () => {
  const draft = buildGeneratedPageDraft(input);
  const result = assessGeneratedDraftQuality({
    draft,
    keywordSet: input.keywordSet,
    row: input.row,
    existingPages: [],
  });

  assert.equal(result.severity, "warning");
  assert.ok(result.issues.length > 0);
});

test("assessGeneratedDraftQuality blocks duplicate generated drafts", () => {
  const draft = buildGeneratedPageDraft(input);
  const result = assessGeneratedDraftQuality({
    draft,
    keywordSet: input.keywordSet,
    row: input.row,
    existingPages: [
      {
        _id: "drafts.generator-page-existing",
        slug: draft.slug,
        generator: draft.generator,
      },
    ],
  });

  assert.equal(result.severity, "blocked");
  assert.ok(result.issues.some((issue) => issue.code === "duplicate-slug"));
});
