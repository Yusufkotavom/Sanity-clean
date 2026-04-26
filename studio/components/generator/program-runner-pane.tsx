import { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Code, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import { findDuplicatePage } from "../../lib/generator/dedupe";
import { assessGeneratedDraftQuality } from "../../lib/generator/qa";
import { buildGeneratedPageDraft } from "../../lib/generator/render";
import { assertGeneratorWriteTarget, buildGeneratedDraftId, buildGeneratedPageId } from "../../lib/generator/write";
import type {
  ExistingPageLike,
  GeneratedPageDraft,
  GeneratorDatasetLite,
  GeneratorKeywordSet,
  GeneratorProgramLite,
  GeneratorQaResult,
  GeneratorRow,
  GeneratorTemplateLite,
  ReferenceValue,
  SlugValue,
} from "../../lib/generator/types";
import { PreviewCard, type PreviewDraftDetails, type PreviewStatus } from "./preview-card";
import { QaSummary } from "./qa-summary";
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
  qa: GeneratorQaResult;
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
  visualPreset,
  motionPreset,
  styleNotes,
  tokenDefinitions[]{_key, name, label, sourceField, fallbackValue, required},
  baseSections,
  optionalSections,
  variationRules,
  sectionVariants[]{_key, key, title, sectionType, copy, colorVariant, requiredTokens, optional}
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
  const [selectedKeywordKey, setSelectedKeywordKey] = useState<string | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
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

  useEffect(() => {
    const nextKeywordKey =
      linkedData.dataset?.keywordSets?.[0]?.key ||
      linkedData.dataset?.keywordSets?.[0]?._key ||
      null;
    const nextRowKey =
      linkedData.dataset?.rows?.[0]?.key ||
      linkedData.dataset?.rows?.[0]?._key ||
      null;

    setSelectedKeywordKey((current) => {
      if (!linkedData.dataset?.keywordSets?.length) return null;

      const stillExists = linkedData.dataset.keywordSets.some(
        (item) => (item.key || item._key) === current,
      );
      return stillExists ? current : nextKeywordKey;
    });

    setSelectedRowKey((current) => {
      if (!linkedData.dataset?.rows?.length) return null;

      const stillExists = linkedData.dataset.rows.some(
        (item) => (item.key || item._key) === current,
      );
      return stillExists ? current : nextRowKey;
    });
  }, [linkedData.dataset]);

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

    const keywordSet =
      linkedData.dataset.keywordSets?.find(
        (item) => (item.key || item._key) === selectedKeywordKey,
      ) || linkedData.dataset.keywordSets?.[0];
    const row =
      linkedData.dataset.rows?.find((item) => (item.key || item._key) === selectedRowKey) ||
      linkedData.dataset.rows?.[0];

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
  }, [
    linkedData.dataset,
    linkedData.template,
    program.dataset?._ref,
    program.template?._ref,
    programLite,
    selectedKeywordKey,
    selectedRowKey,
  ]);

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

    if (linkedData.template?.visualPreset) {
      notes.push(`Visual preset: ${formatLabel(linkedData.template.visualPreset)}.`);
    }

    if (linkedData.template?.motionPreset) {
      notes.push(`Motion preset: ${formatLabel(linkedData.template.motionPreset)}.`);
    }

    if (previewInput?.keywordSet && previewInput?.row) {
      notes.push(
        `Preview uses the selected dataset items: keyword set \"${formatItemLabel(
          previewInput.keywordSet,
          previewInput.keywordSet.primaryKeyword,
        )}\" and row \"${formatItemLabel(previewInput.row, previewInput.row.service || "row")}\".`,
      );
    }

    notes.push(
      "Dry run stays read-only until you explicitly generate drafts. Any write path remains limited to development-dataset drafts only.",
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
  const previewQa = useMemo<GeneratorQaResult | null>(() => {
    if (!previewDraft || !previewInput) {
      return null;
    }

    return assessGeneratedDraftQuality({
      draft: previewDraft,
      keywordSet: previewInput.keywordSet,
      row: previewInput.row,
      existingPages: linkedData.existingPages,
    });
  }, [linkedData.existingPages, previewDraft, previewInput]);
  const previewHasBlockedQa = previewQa?.severity === "blocked";

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
        primaryKeyword: previewInput.keywordSet.primaryKeyword,
        angle: previewInput.keywordSet.angle,
        service: previewInput.row.service,
        city: previewInput.row.city,
        offer: previewInput.row.offer,
        combinationCount: (linkedData.dataset?.keywordSets?.length ?? 0) * (linkedData.dataset?.rows?.length ?? 0),
      }
    : undefined;

  const buildDryRunResult = (options?: {
    selectedOnly?: boolean;
    selectedKeywordSet?: GeneratorKeywordSet;
    selectedRow?: GeneratorRow;
  }): DryRunResult => {
    if (!runProgramInput || !runTemplateInput || !linkedData.dataset) {
      throw new Error("Generator template and dataset must both resolve before running.");
    }

    const keywordSets = linkedData.dataset.keywordSets ?? [];
    const rows = linkedData.dataset.rows ?? [];
    const combinations = options?.selectedOnly
      ? options.selectedKeywordSet && options.selectedRow
        ? [{ keywordSet: options.selectedKeywordSet, row: options.selectedRow }]
        : []
      : keywordSets.flatMap((keywordSet) => rows.map((row) => ({ keywordSet, row })));
    const existingPages = [...linkedData.existingPages];
    const generatedDrafts: GeneratedDraftCandidate[] = [];
    let skipped = 0;
    let conflicts = 0;
    let failed = 0;
    let blocked = 0;
    const conflictExamples: string[] = [];
    const failureExamples: string[] = [];
    const blockedExamples: string[] = [];

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

        const qa = assessGeneratedDraftQuality({
          draft,
          keywordSet: combination.keywordSet,
          row: combination.row,
          existingPages,
        });

        if (qa.severity === "blocked") {
          blocked += 1;
          if (blockedExamples.length < 3) {
            blockedExamples.push(`${pageId} (${qa.issues.map((issue) => issue.code).join(", ")})`);
          }
          continue;
        }

        const draftDocumentId = buildGeneratedDraftId(draft.slug.current);
        generatedDrafts.push({
          documentId: draftDocumentId,
          pageId,
          draft,
          qa,
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
      options?.selectedOnly
        ? `Dry run inspected 1 selected keyword-set x row combination without writing page drafts.`
        : `Dry run inspected ${combinations.length} keyword-set x row combinations without writing page drafts.`,
      `Dedupe policy in effect: ${formatLabel(linkedData.dataset.dedupePolicy)}.`,
    ];

    if (conflictExamples.length > 0) {
      notes.push(`Example duplicate matches: ${conflictExamples.join("; ")}.`);
    }

    if (failureExamples.length > 0) {
      notes.push(`Example build failures: ${failureExamples.join("; ")}.`);
    }

    if (blockedExamples.length > 0) {
      notes.push(`QA blocked combinations: ${blockedExamples.join("; ")}.`);
    }

    if (blocked > 0) {
      notes.push(`QA blocked ${blocked} combination(s); blocked drafts were not written.`);
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
        failed: failed + blocked,
        notes,
        mode: failed > 0 || blocked > 0 ? "error" : "complete",
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

  const handleSelectedDryRun = () => {
    if (!linkedData.template || !linkedData.dataset || !previewInput) {
      return;
    }

    setActiveAction("dry-run");
    setRunSummary({
      generated: 0,
      skipped: 0,
      conflicts: 0,
      failed: 0,
      notes: ["Calculating a dry run for the selected keyword set and row."],
      mode: "running",
      combinationCount: 1,
    });

    try {
      setRunSummary(
        buildDryRunResult({
          selectedOnly: true,
          selectedKeywordSet: previewInput.keywordSet,
          selectedRow: previewInput.row,
        }).summary,
      );
    } catch (error) {
      setRunSummary({
        generated: 0,
        skipped: 0,
        conflicts: 0,
        failed: 1,
        notes: [error instanceof Error ? error.message : "Selected dry-run execution failed."],
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

  const handleGenerateSelectedDraft = async () => {
    if (!linkedData.template || !linkedData.dataset || !previewInput) {
      return;
    }

    setActiveAction("write");
    setRunSummary({
      generated: 0,
      skipped: 0,
      conflicts: 0,
      failed: 0,
      notes: ["Validating development dataset and generating the selected draft only."],
      mode: "running",
      combinationCount: 1,
    });

    try {
      assertGeneratorWriteTarget(currentDataset);
      if (previewHasBlockedQa) {
        throw new Error("Selected draft is blocked by generator QA. Resolve the QA issues before writing.");
      }

      const dryRun = buildDryRunResult({
        selectedOnly: true,
        selectedKeywordSet: previewInput.keywordSet,
        selectedRow: previewInput.row,
      });
      const candidate = dryRun.generatedDrafts[0];

      if (!candidate) {
        setRunSummary({
          ...dryRun.summary,
          notes: [
            ...dryRun.summary.notes,
            "Selected combination did not produce a writable draft because it was skipped, conflicted, or failed validation.",
          ],
        });
        return;
      }

      await client.createIfNotExists({
        _id: candidate.documentId,
        ...candidate.draft,
      });

      setLinkedData((current) => ({
        ...current,
        existingPages: [
          ...current.existingPages,
          {
            _id: candidate.documentId,
            title: candidate.draft.title,
            slug: candidate.draft.slug,
            generator: candidate.draft.generator,
          },
        ],
      }));

      setRunSummary({
        generated: 1,
        skipped: 0,
        conflicts: 0,
        failed: 0,
        notes: [
          `Validated write target dataset: ${currentDataset || "<empty>"}.`,
          `Created selected draft page ${candidate.pageId} with document id ${candidate.documentId}.`,
          ...dryRun.summary.notes,
        ],
        mode: "complete",
        combinationCount: 1,
        sampleSlug: candidate.draft.slug.current,
      });
    } catch (error) {
      setRunSummary({
        generated: 0,
        skipped: 0,
        conflicts: 0,
        failed: 1,
        notes: [error instanceof Error ? error.message : "Selected draft write failed."],
        mode: "error",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const hasBlockingIssues = previewStatus.blockingIssues.length > 0;
  const keywordSets = linkedData.dataset?.keywordSets ?? [];
  const rows = linkedData.dataset?.rows ?? [];

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
              <Text size={1}>Visual preset: {formatLabel(linkedData.template?.visualPreset)}</Text>
              <Text size={1}>Motion preset: {formatLabel(linkedData.template?.motionPreset)}</Text>
              <Text size={1}>Style notes: {valueOrFallback(linkedData.template?.styleNotes)}</Text>
              <Text size={1}>Resolved dataset: {valueOrFallback(linkedData.dataset?.title)}</Text>
              <Text size={1}>Keyword sets: {linkedData.dataset?.keywordSets?.length ?? 0}</Text>
              <Text size={1}>Rows: {linkedData.dataset?.rows?.length ?? 0}</Text>
              <Text size={1}>
                Possible combinations: {(linkedData.dataset?.keywordSets?.length ?? 0) * (linkedData.dataset?.rows?.length ?? 0)}
              </Text>
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
              Selection
            </Heading>
            <Text size={1}>
              Pilih satu keyword set dan satu row untuk preview serta generate draft terpilih. Batch masih tersedia untuk inspeksi menyeluruh.
            </Text>
            {previewInput ? (
              <Card border padding={3} radius={2}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    Selected combination
                  </Text>
                  <Text size={1}>
                    {previewInput.keywordSet.primaryKeyword} · {previewInput.row.service || "service"} · {previewInput.row.city || "city"}
                  </Text>
                  <Text size={1}>
                    Offer: {previewInput.row.offer || "Not set"}{previewInput.keywordSet.angle ? ` · Angle: ${previewInput.keywordSet.angle}` : ""}
                  </Text>
                </Stack>
              </Card>
            ) : null}
            <Grid columns={[1, 1, 2]} gap={4}>
              <Card border padding={3} radius={2}>
                <Stack space={3}>
                  <Heading as="h4" size={1}>
                    Keyword Set
                  </Heading>
                  {keywordSets.length > 0 ? (
                    keywordSets.map((item) => {
                      const itemKey = item.key || item._key || item.primaryKeyword;
                      const isActive = itemKey === selectedKeywordKey;
                      return (
                        <Button
                          key={itemKey}
                          mode={isActive ? "default" : "ghost"}
                          tone={isActive ? "primary" : "default"}
                          onClick={() => setSelectedKeywordKey(itemKey)}
                          text={formatItemLabel(item, item.primaryKeyword)}
                        />
                      );
                    })
                  ) : (
                    <Text size={1}>No keyword sets available.</Text>
                  )}
                </Stack>
              </Card>
              <Card border padding={3} radius={2}>
                <Stack space={3}>
                  <Heading as="h4" size={1}>
                    Row
                  </Heading>
                  {rows.length > 0 ? (
                    rows.map((item) => {
                      const itemKey = item.key || item._key || item.service || "row";
                      const isActive = itemKey === selectedRowKey;
                      return (
                        <Button
                          key={itemKey}
                          mode={isActive ? "default" : "ghost"}
                          tone={isActive ? "primary" : "default"}
                          onClick={() => setSelectedRowKey(itemKey)}
                          text={formatItemLabel(item, item.service || "row")}
                        />
                      );
                    })
                  ) : (
                    <Text size={1}>No rows available.</Text>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Card>

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

        <QaSummary qa={previewQa} />

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>
              Run
            </Heading>
            <Text size={1}>
              Generate Drafts always runs a dry run first, then creates only missing draft page documents in the
              development dataset with deterministic generator-page-slug ids.
            </Text>
            <Grid columns={[1, 1, 2, 2]} gap={3}>
              <Button
                disabled={isLoadingLinkedData || hasBlockingIssues || !previewInput || activeAction === "write"}
                mode="ghost"
                onClick={handleSelectedDryRun}
                text={activeAction === "dry-run" ? "Calculating selected dry run..." : "Dry run selected"}
              />
              <Button
                disabled={isLoadingLinkedData || hasBlockingIssues || previewHasBlockedQa || !previewInput || activeAction === "dry-run"}
                onClick={() => {
                  void handleGenerateSelectedDraft();
                }}
                text={activeAction === "write" ? "Generating selected draft..." : "Generate selected draft"}
                tone="primary"
              />
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
