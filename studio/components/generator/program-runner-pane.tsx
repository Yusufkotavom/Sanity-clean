import { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Code, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import { findDuplicatePage } from "../../lib/generator/dedupe";
import { buildGeneratedPageDraft } from "../../lib/generator/render";
import { assertGeneratorWriteTarget, buildGeneratedDraftId, buildGeneratedPageId } from "../../lib/generator/write";
import type {
  ExistingPageLike,
  GeneratedPageDraft,
  GeneratorDatasetLite,
  GeneratorKeywordSet,
  GeneratorProgramLite,
  GeneratorRow,
  GeneratorTemplateLite,
  ReferenceValue,
  SlugValue,
} from "../../lib/generator/types";
import { PreviewCard, type PreviewDraftDetails, type PreviewStatus } from "./preview-card";
import { RunSummary, type RunSummaryState } from "./run-summary";

type SeoPatternValue = {
  title?: string;
  description?: string;
};

type GeneratorProgramValue = GeneratorProgramLite & {
  template?: ReferenceValue;
  dataset?: ReferenceValue;
  programType?: string;
  generationMode?: string;
  status?: string;
  aiMode?: string;
  defaultSeoPattern?: SeoPatternValue;
};

type GeneratorDatasetDocument = GeneratorDatasetLite & {
  title?: string;
  slug?: SlugValue;
  keywordSets?: GeneratorKeywordSet[];
  rows?: GeneratorRow[];
  dedupePolicy?: "skip-existing-slug" | "flag-conflict";
  status?: string;
};

type GeneratorTemplateDocument = GeneratorTemplateLite;

type ProgramRunnerPaneProps = {
  documentId?: string;
  document?: {
    displayed?: Partial<GeneratorProgramValue> | null;
  };
};

type LinkedGeneratorData = {
  template: GeneratorTemplateDocument | null;
  dataset: GeneratorDatasetDocument | null;
  existingPages: ExistingPageLike[];
};

type PreviewInput = {
  program: GeneratorProgramLite;
  template: GeneratorTemplateDocument;
  keywordSet: GeneratorKeywordSet;
  row: GeneratorRow;
};

type GeneratedDraftCandidate = {
  documentId: string;
  pageId: string;
  draft: GeneratedPageDraft;
};

type DryRunResult = {
  generatedDrafts: GeneratedDraftCandidate[];
  summary: RunSummaryState;
};

const API_VERSION = "2026-03-23";

const sectionCardProps = {
  border: true,
  padding: 4,
  radius: 3,
  tone: "transparent" as const,
};

const TEMPLATE_QUERY = `*[_type == "generatorTemplate" && _id == $id][0]{
  _id,
  title,
  designFamily,
  tokenDefinitions[]{_key, name, label, sourceField, fallbackValue, required},
  baseSections,
  optionalSections,
  variationRules,
  sectionVariants[]{_key, key, title, sectionType, copy, requiredTokens, optional}
}`;

const DATASET_QUERY = `*[_type == "generatorDataset" && _id == $id][0]{
  _id,
  title,
  slug,
  dedupePolicy,
  status,
  keywordSets[]{_key, key, label, primaryKeyword, secondaryKeywords, angle},
  rows[]{_key, key, label, service, city, industry, offer}
}`;

const EXISTING_PAGES_QUERY = `*[_type == "page" && !(_id in path("versions.**"))]{
  _id,
  title,
  slug,
  generator{programId, datasetId, rowKey, keywordKey}
}`;

const formatLabel = (value?: string) =>
  value
    ? value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not set";

const valueOrFallback = (value?: string) => value || "Not set";

const formatItemLabel = (value: { label?: string; key?: string; _key?: string }, fallback: string) =>
  value.label || value.key || value._key || fallback;

const generatedPageIdPrefix = buildGeneratedPageId("");

const toPreviewDraftDetails = (draft: GeneratedPageDraft): PreviewDraftDetails => ({
  title: draft.title,
  slug: draft.slug.current,
  blockCount: draft.blocks.length,
  blockTypes: draft.blocks.map((block) => String(block._type ?? "unknown")),
  generator: {
    programId: draft.generator.programId,
    templateId: draft.generator.templateId,
    datasetId: draft.generator.datasetId,
    rowKey: draft.generator.rowKey,
    keywordKey: draft.generator.keywordKey,
    version: draft.generator.version,
  },
});

export function ProgramRunnerPane(props: ProgramRunnerPaneProps) {
  const program = props.document?.displayed ?? {};
  const documentId = props.documentId || program._id || "unknown";
  const client = useClient({ apiVersion: API_VERSION });
  const [linkedData, setLinkedData] = useState<LinkedGeneratorData>({
    template: null,
    dataset: null,
    existingPages: [],
  });
  const [isLoadingLinkedData, setIsLoadingLinkedData] = useState(false);
  const [linkedDataError, setLinkedDataError] = useState<string | null>(null);
  const [runSummary, setRunSummary] = useState<RunSummaryState>({
    generated: 0,
    skipped: 0,
    conflicts: 0,
    failed: 0,
    notes: [
      "Dry-run summary has not been calculated yet.",
      "Generate Drafts stays limited to development-dataset draft pages after a pre-write dry run.",
    ],
    mode: "idle",
  });
  const [activeAction, setActiveAction] = useState<"dry-run" | "write" | null>(null);
  const currentDataset = `${client.config().dataset || ""}`.trim();

  useEffect(() => {
    const templateId = program.template?._ref;
    const datasetId = program.dataset?._ref;

    if (!templateId || !datasetId) {
      setLinkedData({ template: null, dataset: null, existingPages: [] });
      setLinkedDataError(null);
      setIsLoadingLinkedData(false);
      return;
    }

    let cancelled = false;

    const loadLinkedDocuments = async () => {
      setIsLoadingLinkedData(true);
      setLinkedDataError(null);

      try {
        const [template, dataset, existingPages] = await Promise.all([
          client.fetch<GeneratorTemplateDocument | null>(TEMPLATE_QUERY, { id: templateId }),
          client.fetch<GeneratorDatasetDocument | null>(DATASET_QUERY, { id: datasetId }),
          client.fetch<ExistingPageLike[]>(EXISTING_PAGES_QUERY),
        ]);

        if (cancelled) {
          return;
        }

        setLinkedData({
          template,
          dataset,
          existingPages: existingPages ?? [],
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unknown linked-document fetch failure.";
        setLinkedData({ template: null, dataset: null, existingPages: [] });
        setLinkedDataError(message);
      } finally {
        if (!cancelled) {
          setIsLoadingLinkedData(false);
        }
      }
    };

    void loadLinkedDocuments();

    return () => {
      cancelled = true;
    };
  }, [client, program.dataset?._ref, program.template?._ref]);

  const programLite = useMemo<GeneratorProgramLite>(() => {
    const datasetRef = program.dataset?._ref
      ? {
          _type: "reference" as const,
          _ref: program.dataset._ref,
        }
      : undefined;

    return {
      _id: program._id || documentId,
      routeBase: program.routeBase || "",
      slug: program.slug,
      title: program.title,
      ref: program._id
        ? {
            _type: "reference",
            _ref: program._id,
          }
        : undefined,
      dataset: datasetRef
        ? {
            _id: program.dataset?._ref || linkedData.dataset?._id || "",
            ref: datasetRef,
          }
        : linkedData.dataset?._id
          ? {
              _id: linkedData.dataset._id,
            }
          : undefined,
      defaultSeoPattern: program.defaultSeoPattern,
    };
  }, [documentId, linkedData.dataset?._id, program._id, program.dataset?._ref, program.defaultSeoPattern, program.routeBase, program.slug, program.title]);

  const previewInput = useMemo<PreviewInput | null>(() => {
    if (!linkedData.template || !linkedData.dataset) {
      return null;
    }

    const keywordSet = linkedData.dataset.keywordSets?.[0];
    const row = linkedData.dataset.rows?.[0];

    if (!keywordSet || !row) {
      return null;
    }

    return {
      program: {
        ...programLite,
        dataset: {
          _id: linkedData.dataset._id,
          title: linkedData.dataset.title,
          slug: linkedData.dataset.slug,
          ref: program.dataset?._ref
            ? {
                _type: "reference",
                _ref: program.dataset._ref,
              }
            : programLite.dataset?.ref,
        },
      },
      template: {
        ...linkedData.template,
        ref: program.template?._ref
          ? {
              _type: "reference",
              _ref: program.template._ref,
            }
          : linkedData.template.ref,
      },
      keywordSet,
      row,
    };
  }, [linkedData.dataset, linkedData.template, program.dataset?._ref, program.template?._ref, programLite]);

  const runProgramInput = useMemo<GeneratorProgramLite | null>(() => {
    if (!linkedData.dataset) {
      return null;
    }

    return {
      ...programLite,
      dataset: {
        _id: linkedData.dataset._id,
        title: linkedData.dataset.title,
        slug: linkedData.dataset.slug,
        ref: program.dataset?._ref
          ? {
              _type: "reference",
              _ref: program.dataset._ref,
            }
          : programLite.dataset?.ref,
      },
    };
  }, [linkedData.dataset, program.dataset?._ref, programLite]);

  const runTemplateInput = useMemo<GeneratorTemplateDocument | null>(() => {
    if (!linkedData.template) {
      return null;
    }

    return {
      ...linkedData.template,
      ref: program.template?._ref
        ? {
            _type: "reference",
            _ref: program.template._ref,
          }
        : linkedData.template.ref,
    };
  }, [linkedData.template, program.template?._ref]);

  const previewDraftResult = useMemo<{ draft: GeneratedPageDraft | null; error: string | null }>(() => {
    if (!previewInput) {
      return { draft: null, error: null };
    }

    try {
      return {
        draft: buildGeneratedPageDraft(previewInput),
        error: null,
      };
    } catch (error) {
      return {
        draft: null,
        error: error instanceof Error ? error.message : "Failed to build preview draft.",
      };
    }
  }, [previewInput]);

  const previewStatus = useMemo<PreviewStatus>(() => {
    const blockingIssues: string[] = [];
    const notes: string[] = [];

    if (!program.title) {
      blockingIssues.push("Program title is still empty.");
    }

    if (!program.template?._ref) {
      blockingIssues.push("Select a generator template before previewing runs.");
    }

    if (!program.dataset?._ref) {
      blockingIssues.push("Select a generator dataset before previewing inputs.");
    }

    if (!program.routeBase) {
      blockingIssues.push("Set a route base so future generated pages have a stable root.");
    }

    if (linkedDataError) {
      blockingIssues.push(`Linked document load failed: ${linkedDataError}`);
    }

    if (program.template?._ref && !isLoadingLinkedData && !linkedData.template) {
      blockingIssues.push("Selected generator template could not be resolved from Sanity.");
    }

    if (program.dataset?._ref && !isLoadingLinkedData && !linkedData.dataset) {
      blockingIssues.push("Selected generator dataset could not be resolved from Sanity.");
    }

    if (linkedData.dataset && !(linkedData.dataset.keywordSets?.length ?? 0)) {
      blockingIssues.push("Selected dataset does not contain any keyword sets for preview.");
    }

    if (linkedData.dataset && !(linkedData.dataset.rows?.length ?? 0)) {
      blockingIssues.push("Selected dataset does not contain any rows for preview.");
    }

    try {
      assertGeneratorWriteTarget(currentDataset);
    } catch (error) {
      blockingIssues.push(error instanceof Error ? error.message : "Generator writes are not allowed for the current dataset.");
    }

    if (previewDraftResult.error) {
      blockingIssues.push(`Preview build failed: ${previewDraftResult.error}`);
    }

    if (!program.defaultSeoPattern?.title) {
      notes.push("Default SEO title pattern is empty.");
    }

    if (!program.defaultSeoPattern?.description) {
      notes.push("Default SEO description pattern is empty.");
    }

    if (linkedData.dataset?.dedupePolicy) {
      notes.push(`Dry-run dedupe policy: ${formatLabel(linkedData.dataset.dedupePolicy)}.`);
    }

    if (previewInput?.keywordSet && previewInput?.row) {
      notes.push(
        `Preview uses the first dataset items: keyword set \"${formatItemLabel(
          previewInput.keywordSet,
          previewInput.keywordSet.primaryKeyword,
        )}\" and row \"${formatItemLabel(previewInput.row, previewInput.row.service || "row")}\".`,
      );
    }

    notes.push(
      "Dry run stays read-only until you explicitly use Generate Drafts. Any write path remains limited to development-dataset drafts only.",
    );

    return {
      blockingIssues,
      notes,
      mode: linkedDataError ? "error" : isLoadingLinkedData ? "loading" : blockingIssues.length > 0 ? "blocked" : "ready",
    };
  }, [
    isLoadingLinkedData,
    linkedData.dataset,
    linkedData.template,
    linkedDataError,
    previewDraftResult.error,
    previewInput?.keywordSet,
    previewInput?.row,
    currentDataset,
    program.dataset?._ref,
    program.defaultSeoPattern?.description,
    program.defaultSeoPattern?.title,
    program.routeBase,
    program.template?._ref,
    program.title,
  ]);

  const previewDraft = previewDraftResult.draft;

  const previewPath = previewDraft?.slug.current
    ? `/${previewDraft.slug.current}`
    : previewInput
      ? "Unavailable because preview draft did not build."
      : "Unavailable until route base, template, dataset, and preview inputs are resolved.";

  const previewSelection = previewInput
    ? {
        templateTitle: previewInput.template.title,
        datasetTitle: linkedData.dataset?.title,
        keywordSetLabel: formatItemLabel(previewInput.keywordSet, previewInput.keywordSet.primaryKeyword),
        rowLabel: formatItemLabel(previewInput.row, previewInput.row.service || "row"),
      }
    : undefined;

  const buildDryRunResult = (): DryRunResult => {
    if (!runProgramInput || !runTemplateInput || !linkedData.dataset) {
      throw new Error("Generator template and dataset must both resolve before running.");
    }

    const keywordSets = linkedData.dataset.keywordSets ?? [];
    const rows = linkedData.dataset.rows ?? [];
    const combinations = keywordSets.flatMap((keywordSet) => rows.map((row) => ({ keywordSet, row })));
    const existingPages = [...linkedData.existingPages];
    const generatedDrafts: GeneratedDraftCandidate[] = [];
    let skipped = 0;
    let conflicts = 0;
    let failed = 0;
    const conflictExamples: string[] = [];
    const failureExamples: string[] = [];

    for (const combination of combinations) {
      try {
        const draft = buildGeneratedPageDraft({
          program: runProgramInput,
          template: runTemplateInput,
          keywordSet: combination.keywordSet,
          row: combination.row,
        });

        const duplicate = findDuplicatePage(existingPages, {
          slug: draft.slug.current,
          programId: draft.generator.programId,
          rowKey: draft.generator.rowKey,
          keywordKey: draft.generator.keywordKey,
        });

        const pageId = buildGeneratedPageId(draft.slug.current);

        if (duplicate) {
          const example = `${pageId} (${duplicate.reason})`;
          if (linkedData.dataset.dedupePolicy === "skip-existing-slug" && duplicate.reason === "slug") {
            skipped += 1;
          } else {
            conflicts += 1;
          }

          if (conflictExamples.length < 3) {
            conflictExamples.push(example);
          }
          continue;
        }

        const draftDocumentId = buildGeneratedDraftId(draft.slug.current);
        generatedDrafts.push({
          documentId: draftDocumentId,
          pageId,
          draft,
        });
        existingPages.push({
          _id: draftDocumentId,
          title: draft.title,
          slug: draft.slug,
          generator: draft.generator,
        });
      } catch (error) {
        failed += 1;
        if (failureExamples.length < 3) {
          failureExamples.push(error instanceof Error ? error.message : "Unknown dry-run failure.");
        }
      }
    }

    const notes = [
      `Dry run inspected ${combinations.length} keyword-set x row combinations without writing page drafts.`,
      `Dedupe policy in effect: ${formatLabel(linkedData.dataset.dedupePolicy)}.`,
    ];

    if (conflictExamples.length > 0) {
      notes.push(`Example duplicate matches: ${conflictExamples.join("; ")}.`);
    }

    if (failureExamples.length > 0) {
      notes.push(`Example build failures: ${failureExamples.join("; ")}.`);
    }

    if (previewDraft?.slug.current) {
      notes.push(`Current preview slug: ${previewDraft.slug.current}.`);
    }

    return {
      generatedDrafts,
      summary: {
        generated: generatedDrafts.length,
        skipped,
        conflicts,
        failed,
        notes,
        mode: failed > 0 ? "error" : "complete",
        combinationCount: combinations.length,
        sampleSlug: previewDraft?.slug.current,
      },
    };
  };

  const handleDryRun = () => {
    if (!linkedData.template || !linkedData.dataset) {
      return;
    }

    const keywordSets = linkedData.dataset.keywordSets ?? [];
    const rows = linkedData.dataset.rows ?? [];

    setActiveAction("dry-run");
    setRunSummary({
      generated: 0,
      skipped: 0,
      conflicts: 0,
      failed: 0,
      notes: ["Calculating dry-run combinations from the current template and dataset."],
      mode: "running",
      combinationCount: keywordSets.length * rows.length,
    });

    try {
      setRunSummary(buildDryRunResult().summary);
    } catch (error) {
      setRunSummary({
        generated: 0,
        skipped: 0,
        conflicts: 0,
        failed: 1,
        notes: [error instanceof Error ? error.message : "Dry-run execution failed."],
        mode: "error",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const handleGenerateDrafts = async () => {
    if (!linkedData.template || !linkedData.dataset) {
      return;
    }

    const keywordSets = linkedData.dataset.keywordSets ?? [];
    const rows = linkedData.dataset.rows ?? [];

    setActiveAction("write");
    setRunSummary({
      generated: 0,
      skipped: 0,
      conflicts: 0,
      failed: 0,
      notes: ["Validating development dataset and running a pre-write dry run."],
      mode: "running",
      combinationCount: keywordSets.length * rows.length,
    });

    try {
      assertGeneratorWriteTarget(currentDataset);

      const dryRun = buildDryRunResult();
      const writtenPageIds: string[] = [];
      const writeFailures: string[] = [];

      for (const candidate of dryRun.generatedDrafts) {
        try {
          await client.createIfNotExists({
            _id: candidate.documentId,
            ...candidate.draft,
          });
          writtenPageIds.push(candidate.pageId);
        } catch (error) {
          writeFailures.push(
            error instanceof Error ? `${candidate.pageId}: ${error.message}` : `${candidate.pageId}: Unknown write failure.`,
          );
        }
      }

      const nextFailedCount = dryRun.summary.failed + writeFailures.length;
      const nextNotes = [
        `Validated write target dataset: ${currentDataset || "<empty>"}.`,
        `Dry run completed before write and found ${dryRun.generatedDrafts.length} missing draft candidates.`,
        `Created ${writtenPageIds.length} development draft page documents with ids prefixed by ${generatedPageIdPrefix}.`,
        ...dryRun.summary.notes,
      ];

      if (writtenPageIds.length > 0) {
        nextNotes.push(`Example created draft ids: ${writtenPageIds.slice(0, 3).join(", ")}.`);
      }

      if (writeFailures.length > 0) {
        nextNotes.push(`Example write failures: ${writeFailures.slice(0, 3).join("; ")}.`);
      }

      setRunSummary({
        generated: writtenPageIds.length,
        skipped: dryRun.summary.skipped,
        conflicts: dryRun.summary.conflicts,
        failed: nextFailedCount,
        notes: nextNotes,
        mode: nextFailedCount > 0 ? "error" : "complete",
        combinationCount: dryRun.summary.combinationCount,
        sampleSlug: dryRun.summary.sampleSlug,
      });

      if (writtenPageIds.length > 0) {
        setLinkedData((current) => ({
          ...current,
          existingPages: [
            ...current.existingPages,
            ...dryRun.generatedDrafts
              .filter((candidate) => writtenPageIds.includes(candidate.pageId))
              .map((candidate) => ({
                _id: candidate.documentId,
                title: candidate.draft.title,
                slug: candidate.draft.slug,
                generator: candidate.draft.generator,
              })),
          ],
        }));
      }
    } catch (error) {
      setRunSummary({
        generated: 0,
        skipped: 0,
        conflicts: 0,
        failed: 1,
        notes: [error instanceof Error ? error.message : "Generator write execution failed."],
        mode: "error",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const hasBlockingIssues = previewStatus.blockingIssues.length > 0;

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={2}>
          <Heading as="h2" size={2}>
            Generator Run
          </Heading>
          <Text muted size={1}>
            Development-only deterministic preview, dry run, and draft-only write path. This pane validates the current
            dataset before creating any generated page drafts.
          </Text>
        </Stack>

        <Grid columns={[1, 1, 2]} gap={4}>
          <Card {...sectionCardProps}>
            <Stack space={3}>
              <Heading as="h3" size={1}>
                Program Setup
              </Heading>
              <Text size={1}>
                Document ID: <Code size={1}>{documentId}</Code>
              </Text>
              <Text size={1}>Title: {valueOrFallback(program.title)}</Text>
              <Text size={1}>Slug: {valueOrFallback(program.slug?.current)}</Text>
              <Text size={1}>Route base: {valueOrFallback(program.routeBase)}</Text>
              <Text size={1}>Template ref: {valueOrFallback(program.template?._ref)}</Text>
              <Text size={1}>Dataset ref: {valueOrFallback(program.dataset?._ref)}</Text>
            </Stack>
          </Card>

          <Card {...sectionCardProps}>
            <Stack space={3}>
              <Heading as="h3" size={1}>
                Inputs
              </Heading>
              <Text size={1}>Program type: {formatLabel(program.programType)}</Text>
              <Text size={1}>Generation mode: {formatLabel(program.generationMode)}</Text>
              <Text size={1}>Status: {formatLabel(program.status)}</Text>
              <Text size={1}>AI mode: {formatLabel(program.aiMode)}</Text>
              <Text size={1}>Resolved template: {valueOrFallback(linkedData.template?.title)}</Text>
              <Text size={1}>Resolved dataset: {valueOrFallback(linkedData.dataset?.title)}</Text>
              <Text size={1}>Keyword sets: {linkedData.dataset?.keywordSets?.length ?? 0}</Text>
              <Text size={1}>Rows: {linkedData.dataset?.rows?.length ?? 0}</Text>
              {isLoadingLinkedData ? (
                <Text size={1}>
                  <Spinner muted /> Loading linked template, dataset, and existing-page inputs.
                </Text>
              ) : null}
            </Stack>
          </Card>
        </Grid>

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>
              Preview
            </Heading>
            <PreviewCard
              previewPath={previewPath}
              seoTitle={program.defaultSeoPattern?.title}
              seoDescription={program.defaultSeoPattern?.description}
              status={previewStatus}
              draft={previewDraft ? toPreviewDraftDetails(previewDraft) : undefined}
              selection={previewSelection}
            />
          </Stack>
        </Card>

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>
              Run
            </Heading>
            <Text size={1}>
              Generate Drafts always runs a dry run first, then creates only missing draft page documents in the
              development dataset with deterministic generator-page-slug ids.
            </Text>
            <Grid columns={[1, 1, 2]} gap={3}>
              <Button
                disabled={isLoadingLinkedData || hasBlockingIssues || activeAction === "write"}
                mode="ghost"
                onClick={handleDryRun}
                text={activeAction === "dry-run" ? "Calculating dry run..." : "Run batch dry run"}
              />
              <Button
                disabled={isLoadingLinkedData || hasBlockingIssues || activeAction === "dry-run"}
                onClick={() => {
                  void handleGenerateDrafts();
                }}
                text={activeAction === "write" ? "Generating drafts..." : "Generate Drafts"}
                tone="primary"
              />
            </Grid>
            <RunSummary summary={runSummary} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
