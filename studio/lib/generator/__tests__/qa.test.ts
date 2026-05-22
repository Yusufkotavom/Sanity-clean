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
      description: "Jasa pembuatan website dengan landing page fokus conversion.",
    },
  },
  template: {
    _id: "gt-1",
    title: "Sample Template",
    designFamily: "multi-service",
    routeBase: "/sample-generator",
    slugPattern: "{{routeBase}}-{{city}}",
    seoMeta: {
      titlePattern: "{{primaryKeyword}} | Kotacom",
      descriptionPattern: "{{offer}} di {{city}}. {{localCondition}}",
    },
    tokenDefinitions: [
      { name: "primaryKeyword", sourceField: "primaryKeyword", required: true },
      { name: "service", sourceField: "service", required: true },
      { name: "city", sourceField: "city", required: true },
      { name: "offer", sourceField: "offer", required: true },
      { name: "localCondition", sourceField: "localCondition" },
    ],
    blocks: [
      {
        _type: "hero-1", _key: "hero",
        title: "{{primaryKeyword}} {{city}}",
        body: [{ _key: "hero-body", _type: "block", style: "normal", markDefs: [], children: [{ _key: "hero-span", _type: "span", marks: [], text: "Mulai {{offer}}" }] }],
      },
      {
        _type: "section-header", _key: "context",
        title: "Konteks {{city}}", description: "Fokus {{primaryKeyword}}",
      },
      {
        _type: "cta-1", _key: "final-cta",
        title: "Konsultasi {{service}}",
      },
    ],
  },
  row: {
    _key: "row-jakarta",
    key: "row-jakarta",
    service: "pembuatan website",
    city: "jakarta",
    primaryKeyword: "jasa pembuatan website conversion",
    secondaryKeywords: ["web developer jakarta", "bikin website jakarta"],
    industry: "bisnis jasa",
    offer: "audit struktur halaman",
    localCondition: "Pasar paling kompetitif di Indonesia",
  },
};

test("assessGeneratedDraftQuality returns warning for a minimal but valid generated draft", () => {
  const draft = buildGeneratedPageDraft(input);
  const result = assessGeneratedDraftQuality({
    draft,
    keywordSet: { primaryKeyword: input.row.primaryKeyword, secondaryKeywords: input.row.secondaryKeywords },
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
    keywordSet: { primaryKeyword: input.row.primaryKeyword },
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
