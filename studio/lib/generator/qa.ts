import { findDuplicatePage } from "./dedupe";
import type {
  ExistingPageLike,
  GeneratedPageDraft,
  GeneratorKeywordSet,
  GeneratorQaIssue,
  GeneratorQaResult,
  GeneratorRow,
} from "./types";

const SEO_TITLE_WARNING_MIN = 30;
const SEO_TITLE_WARNING_MAX = 70;
const SEO_DESCRIPTION_WARNING_MIN = 110;
const SEO_DESCRIPTION_WARNING_MAX = 170;
const SLUG_WARNING_LENGTH = 80;
const SLUG_BLOCK_LENGTH = 96;

const getHighestSeverity = (issues: GeneratorQaIssue[]): GeneratorQaResult["severity"] => {
  if (issues.some((issue) => issue.severity === "blocked")) return "blocked";
  if (issues.some((issue) => issue.severity === "warning")) return "warning";
  return "ready";
};

const includesNormalized = (haystack: string, needle: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase().trim());

export const assessGeneratedDraftQuality = ({
  draft,
  keywordSet,
  row,
  existingPages,
}: {
  draft: GeneratedPageDraft;
  keywordSet: GeneratorKeywordSet;
  row: GeneratorRow;
  existingPages: ExistingPageLike[];
}): GeneratorQaResult => {
  const issues: GeneratorQaIssue[] = [];
  const seoTitle = draft.meta?.title?.trim() || "";
  const seoDescription = draft.meta?.description?.trim() || "";
  const primaryKeyword = keywordSet.primaryKeyword?.trim() || "";
  const service = row.service?.trim() || "";
  const city = row.city?.trim() || "";
  const blockTypes = draft.blocks.map((block) => String(block._type || ""));
  const uniqueBlockTypes = new Set(blockTypes.filter(Boolean));

  const duplicate = findDuplicatePage(existingPages, {
    slug: draft.slug.current,
    programId: draft.generator.programId,
    rowKey: draft.generator.rowKey,
    keywordKey: draft.generator.keywordKey,
  });

  if (duplicate) {
    issues.push({
      severity: "blocked",
      code: `duplicate-${duplicate.reason}`,
      message: `Duplicate ${duplicate.reason} detected against ${duplicate.existing?._id || "an existing page"}.`,
    });
  }

  if (!seoTitle) {
    issues.push({
      severity: "blocked",
      code: "missing-seo-title",
      message: "SEO title is empty.",
    });
  } else if (
    seoTitle.length < SEO_TITLE_WARNING_MIN ||
    seoTitle.length > SEO_TITLE_WARNING_MAX
  ) {
    issues.push({
      severity: "warning",
      code: "seo-title-length",
      message: `SEO title length is ${seoTitle.length}; target is ${SEO_TITLE_WARNING_MIN}-${SEO_TITLE_WARNING_MAX}.`,
    });
  }

  if (!seoDescription) {
    issues.push({
      severity: "blocked",
      code: "missing-seo-description",
      message: "SEO description is empty.",
    });
  } else if (
    seoDescription.length < SEO_DESCRIPTION_WARNING_MIN ||
    seoDescription.length > SEO_DESCRIPTION_WARNING_MAX
  ) {
    issues.push({
      severity: "warning",
      code: "seo-description-length",
      message: `SEO description length is ${seoDescription.length}; target is ${SEO_DESCRIPTION_WARNING_MIN}-${SEO_DESCRIPTION_WARNING_MAX}.`,
    });
  }

  if (draft.slug.current.length >= SLUG_BLOCK_LENGTH) {
    issues.push({
      severity: "blocked",
      code: "slug-too-long",
      message: `Slug length is ${draft.slug.current.length}; it must stay below ${SLUG_BLOCK_LENGTH}.`,
    });
  } else if (draft.slug.current.length >= SLUG_WARNING_LENGTH) {
    issues.push({
      severity: "warning",
      code: "slug-near-limit",
      message: `Slug length is ${draft.slug.current.length}; it is close to the safe limit.`,
    });
  }

  if (!blockTypes.includes("hero-1")) {
    issues.push({
      severity: "warning",
      code: "missing-hero",
      message: "Generated page is missing a hero block.",
    });
  }

  if (draft.blocks.length < 3) {
    issues.push({
      severity: "warning",
      code: "too-few-blocks",
      message: `Generated page only contains ${draft.blocks.length} blocks.`,
    });
  } else if (draft.blocks.length < 5) {
    issues.push({
      severity: "warning",
      code: "thin-structure",
      message: `Generated page contains ${draft.blocks.length} blocks; structure may still feel thin.`,
    });
  }

  if (uniqueBlockTypes.size < 3) {
    issues.push({
      severity: "warning",
      code: "low-block-variety",
      message: "Generated page uses too few distinct block types and may feel repetitive.",
    });
  }

  if (!blockTypes.includes("cta-1")) {
    issues.push({
      severity: "warning",
      code: "missing-final-cta",
      message: "Generated page does not include a dedicated final CTA block.",
    });
  }

  if (primaryKeyword && !includesNormalized(seoTitle, primaryKeyword)) {
    issues.push({
      severity: "warning",
      code: "keyword-not-in-title",
      message: "Primary keyword does not appear in the SEO title.",
    });
  }

  if (service && !includesNormalized(seoDescription, service)) {
    issues.push({
      severity: "warning",
      code: "service-not-in-description",
      message: "Service token does not appear in the SEO description.",
    });
  }

  if (city && !includesNormalized(draft.title, city)) {
    issues.push({
      severity: "warning",
      code: "city-not-in-title",
      message: "Row city does not appear in the generated page title.",
    });
  }

  return {
    severity: getHighestSeverity(issues),
    issues,
  };
};
