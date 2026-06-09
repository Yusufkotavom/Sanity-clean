export const buildGeneratedPageId = (slug: string) => `generator-page-${slug}`;

export const buildGeneratedDraftId = (slug: string) => `drafts.${buildGeneratedPageId(slug)}`;
