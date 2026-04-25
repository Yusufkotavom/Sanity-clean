import type { DuplicateMatch, ExistingPageLike } from "./types";

const sameLineage = (
  existing: ExistingPageLike,
  programId: string,
  rowKey: string,
  keywordKey: string,
) =>
  existing.generator?.programId === programId &&
  existing.generator?.rowKey === rowKey &&
  existing.generator?.keywordKey === keywordKey;

export const detectDuplicateSlug = (existing: ExistingPageLike[], nextSlug: string) =>
  existing.some((item) => item?.slug?.current === nextSlug);

export const findDuplicatePage = (
  existing: ExistingPageLike[],
  input: {
    slug: string;
    programId: string;
    rowKey: string;
    keywordKey: string;
  },
): DuplicateMatch | null => {
  const slugMatch = existing.find((item) => item?.slug?.current === input.slug);
  if (slugMatch) {
    return {
      reason: "slug",
      existing: slugMatch,
    };
  }

  const lineageMatch = existing.find((item) =>
    sameLineage(item, input.programId, input.rowKey, input.keywordKey),
  );

  return lineageMatch
    ? {
        reason: "lineage",
        existing: lineageMatch,
      }
    : null;
};
