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
      { name: "location", sourceField: "city", required: true },
      { name: "offer", sourceField: "offer", required: true },
      { name: "industry", sourceField: "industry", required: true },
    ],
    baseSections: ["hero", "highlights", "serviceTypes", "pricing", "faq", "finalCta"],
    optionalSections: [],
    variationRules: ["finished-sample-showcase"],
    sectionVariants: [
      { key: "hero", title: "{{primaryKeyword}} {{city}}", sectionType: "hero-1", requiredTokens: ["primaryKeyword", "city"] },
      { key: "highlights", title: "Outcome {{service}}", sectionType: "value-props-block", requiredTokens: ["service"] },
      { key: "serviceTypes", title: "Pilihan {{service}}", sectionType: "service-types-block", requiredTokens: ["service"] },
      { key: "pricing", title: "Harga {{service}}", sectionType: "pricing-block", requiredTokens: ["service"] },
      { key: "faq", title: "FAQ {{offer}}", sectionType: "faq-block", requiredTokens: ["offer"] },
      { key: "finalCta", title: "Mulai {{offer}}", sectionType: "cta-1", requiredTokens: ["offer"] },
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

test("assessGeneratedDraftQuality returns ready for a healthy generated draft", () => {
  const draft = buildGeneratedPageDraft(input);
  const result = assessGeneratedDraftQuality({
    draft,
    keywordSet: input.keywordSet,
    row: input.row,
    existingPages: [],
  });

  assert.equal(result.severity, "ready");
  assert.equal(result.issues.length, 0);
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
