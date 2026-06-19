export const buildGeneratedPageId = (slug: string) => {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_.-]/g, "-");
  return `generator-page-${safeSlug}`;
};

export const buildGeneratedDraftId = (slug: string) => `drafts.${buildGeneratedPageId(slug)}`;
