export const assertGeneratorWriteTarget = (dataset: string) => {
  const normalizedDataset = dataset.trim().toLowerCase();

  if (!normalizedDataset) {
    throw new Error("Generator V2 write target is missing a dataset name.");
  }

  if (normalizedDataset !== "development") {
    throw new Error(`Generator V2 must only write to the development dataset. Received: ${dataset || "<empty>"}.`);
  }
};

export const buildGeneratedPageId = (slug: string) => `generator-page-${slug}`;

export const buildGeneratedDraftId = (slug: string) => `drafts.${buildGeneratedPageId(slug)}`;
