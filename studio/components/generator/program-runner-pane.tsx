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

type GeneratorProgramValue = GeneratorProgramLite & {
  template?: ReferenceValue;
  dataset?: ReferenceValue;
  programType?: string;
  generationMode?: string;
  status?: string;
  aiMode?: string;
  defaultSeoPattern?: { title?: string; description?: string };
};

type GeneratorDatasetDocument = GeneratorDatasetLite & {
  title?: string;
  slug?: SlugValue;
  rows?: GeneratorRow[];
  dedupePolicy?: "skip-existing-slug" | "flag-conflict";
  status?: string;
};

type ProgramRunnerPaneProps = {
  documentId?: string;
  document?: { displayed?: Partial<GeneratorProgramValue> | null };
};

type LinkedGeneratorData = {
  template: GeneratorTemplateLite | null;
  dataset: GeneratorDatasetDocument | null;
  existingPages: ExistingPageLike[];
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

const sectionCardProps = { border: true, padding: 4, radius: 3, tone: "transparent" as const };

const TEMPLATE_QUERY = `*[_type == "generatorTemplate" && _id == $id][0]{
  _id, title,
  routeBase, slugPattern, seoMeta, aggregateRatingDefaults,
  tokenDefinitions[]{_key, name, label, sourceField, fallbackValue, required},
  blocks
}`;

const DATASET_QUERY = `*[_type == "generatorDataset" && _id == $id][0]{
  _id, title, slug, dedupePolicy, status,
  rows[]{_key, key, label, service, city, primaryKeyword, secondaryKeywords, industry, offer, localCondition, tokens}
}`;

const EXISTING_PAGES_QUERY = `*[_type == "page" && !(_id in path("versions.**"))]{
  _id, title, slug, generator{programId, datasetId, rowKey, keywordKey}
}`;

const formatLabel = (value?: string) =>
  value ? value.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ") : "Not set";

const valueOrFallback = (value?: string) => value || "Not set";

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
  const [linkedData, setLinkedData] = useState<LinkedGeneratorData>({ template: null, dataset: null, existingPages: [] });
  const [isLoadingLinkedData, setIsLoadingLinkedData] = useState(false);
  const [linkedDataError, setLinkedDataError] = useState<string | null>(null);
  const [runSummary, setRunSummary] = useState<RunSummaryState>({
    generated: 0, skipped: 0, conflicts: 0, failed: 0,
    notes: ["Ready. Click 'Dry Run' to inspect all rows or 'Generate Drafts' to write."],
    mode: "idle",
  });
  const [activeAction, setActiveAction] = useState<"dry-run" | "write" | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const currentDataset = `${client.config().dataset || ""}`.trim();

  useEffect(() => {
    const templateId = program.template?._ref;
    const datasetId = program.dataset?._ref;
    if (!templateId || !datasetId) {
      setLinkedData({ template: null, dataset: null, existingPages: [] });
      return;
    }
    let cancelled = false;
    const load = async () => {
      setIsLoadingLinkedData(true);
      setLinkedDataError(null);
      try {
        const [template, dataset, existingPages] = await Promise.all([
          client.fetch<GeneratorTemplateLite | null>(TEMPLATE_QUERY, { id: templateId }),
          client.fetch<GeneratorDatasetDocument | null>(DATASET_QUERY, { id: datasetId }),
          client.fetch<ExistingPageLike[]>(EXISTING_PAGES_QUERY),
        ]);
        if (!cancelled) setLinkedData({ template, dataset, existingPages: existingPages ?? [] });
      } catch (error) {
        if (!cancelled) {
          setLinkedDataError(error instanceof Error ? error.message : "Fetch failed.");
          setLinkedData({ template: null, dataset: null, existingPages: [] });
        }
      } finally {
        if (!cancelled) setIsLoadingLinkedData(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [client, program.dataset?._ref, program.template?._ref]);

  const rows = linkedData.dataset?.rows ?? [];
  const selectedRow = rows[selectedRowIndex] || rows[0] || null;

  const programLite = useMemo<GeneratorProgramLite>(() => ({
    _id: program._id || documentId,
    routeBase: program.routeBase || "",
    slugPattern: program.slugPattern || undefined,
    slug: program.slug,
    title: program.title,
    ref: program._id ? { _type: "reference", _ref: program._id } : undefined,
    dataset: linkedData.dataset?._id ? { _id: linkedData.dataset._id, title: linkedData.dataset.title, slug: linkedData.dataset.slug } : undefined,
    defaultSeoPattern: program.defaultSeoPattern,
  }), [documentId, linkedData.dataset, program]);

  const previewDraft = useMemo<GeneratedPageDraft | null>(() => {
    if (!linkedData.template || !selectedRow) return null;
    try {
      return buildGeneratedPageDraft({ program: programLite, template: linkedData.template, row: selectedRow });
    } catch { return null; }
  }, [linkedData.template, programLite, selectedRow]);

  const previewQa = useMemo<GeneratorQaResult | null>(() => {
    if (!previewDraft || !selectedRow) return null;
    return assessGeneratedDraftQuality({ draft: previewDraft, keywordSet: { primaryKeyword: selectedRow.primaryKeyword, secondaryKeywords: selectedRow.secondaryKeywords }, row: selectedRow, existingPages: linkedData.existingPages });
  }, [linkedData.existingPages, previewDraft, selectedRow]);

  const previewStatus = useMemo<PreviewStatus>(() => {
    const blockingIssues: string[] = [];
    const notes: string[] = [];
    if (!program.template?._ref) blockingIssues.push("Select a generator template.");
    if (!program.dataset?._ref) blockingIssues.push("Select a generator dataset.");
    if (linkedDataError) blockingIssues.push(`Load error: ${linkedDataError}`);
    if (linkedData.dataset && !rows.length) blockingIssues.push("Dataset has no rows.");
    try { assertGeneratorWriteTarget(currentDataset); } catch (e) { blockingIssues.push(e instanceof Error ? e.message : "Write not allowed."); }
    notes.push(`${rows.length} rows → ${rows.length} pages will be generated.`);
    if (linkedData.template?.routeBase) notes.push(`Route base: ${linkedData.template.routeBase}`);
    return { blockingIssues, notes, mode: blockingIssues.length > 0 ? "blocked" : isLoadingLinkedData ? "loading" : "ready" };
  }, [currentDataset, isLoadingLinkedData, linkedData, linkedDataError, program, rows.length]);

  const buildDryRunResult = (): DryRunResult => {
    if (!linkedData.template || !linkedData.dataset) throw new Error("Template and dataset must resolve.");
    const existingPages = [...linkedData.existingPages];
    const generatedDrafts: GeneratedDraftCandidate[] = [];
    let skipped = 0, conflicts = 0, failed = 0;
    const notes: string[] = [];

    for (const row of rows) {
      try {
        const draft = buildGeneratedPageDraft({ program: programLite, template: linkedData.template, row });
        const duplicate = findDuplicatePage(existingPages, {
          slug: draft.slug.current, programId: draft.generator.programId,
          rowKey: draft.generator.rowKey, keywordKey: draft.generator.keywordKey,
        });
        const pageId = buildGeneratedPageId(draft.slug.current);
        if (duplicate) {
          if (linkedData.dataset.dedupePolicy === "skip-existing-slug" && duplicate.reason === "slug") skipped++;
          else conflicts++;
          continue;
        }
        const qa = assessGeneratedDraftQuality({ draft, keywordSet: { primaryKeyword: row.primaryKeyword, secondaryKeywords: row.secondaryKeywords }, row, existingPages });
        if (qa.severity === "blocked") { failed++; continue; }
        const draftDocumentId = buildGeneratedDraftId(draft.slug.current);
        generatedDrafts.push({ documentId: draftDocumentId, pageId, draft, qa });
        existingPages.push({ _id: draftDocumentId, title: draft.title, slug: draft.slug, generator: draft.generator });
      } catch { failed++; }
    }

    notes.push(`Inspected ${rows.length} rows (1 row = 1 page). Dedupe: ${formatLabel(linkedData.dataset.dedupePolicy)}.`);
    return {
      generatedDrafts,
      summary: { generated: generatedDrafts.length, skipped, conflicts, failed, notes, mode: failed > 0 ? "error" : "complete", combinationCount: rows.length, sampleSlug: previewDraft?.slug.current },
    };
  };

  const handleDryRun = () => {
    setActiveAction("dry-run");
    try { setRunSummary(buildDryRunResult().summary); }
    catch (e) { setRunSummary({ generated: 0, skipped: 0, conflicts: 0, failed: 1, notes: [e instanceof Error ? e.message : "Failed."], mode: "error" }); }
    finally { setActiveAction(null); }
  };

  const handleGenerateDrafts = async () => {
    setActiveAction("write");
    try {
      assertGeneratorWriteTarget(currentDataset);
      const dryRun = buildDryRunResult();
      const written: string[] = [];
      for (const c of dryRun.generatedDrafts) {
        try { await client.createIfNotExists({ _id: c.documentId, ...c.draft }); written.push(c.pageId); } catch {}
      }
      setRunSummary({ ...dryRun.summary, generated: written.length, notes: [...dryRun.summary.notes, `Created ${written.length} draft pages.`], mode: "complete" });
      if (written.length > 0) {
        setLinkedData((cur) => ({ ...cur, existingPages: [...cur.existingPages, ...dryRun.generatedDrafts.filter((c) => written.includes(c.pageId)).map((c) => ({ _id: c.documentId, title: c.draft.title, slug: c.draft.slug, generator: c.draft.generator }))] }));
      }
    } catch (e) { setRunSummary({ generated: 0, skipped: 0, conflicts: 0, failed: 1, notes: [e instanceof Error ? e.message : "Write failed."], mode: "error" }); }
    finally { setActiveAction(null); }
  };

  const hasBlockingIssues = previewStatus.blockingIssues.length > 0;

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={2}>
          <Heading as="h2" size={2}>Generator Run</Heading>
          <Text muted size={1}>1 row = 1 page. Template provides blocks + SEO. Dataset provides per-page data.</Text>
        </Stack>

        <Grid columns={[1, 1, 2]} gap={4}>
          <Card {...sectionCardProps}>
            <Stack space={3}>
              <Heading as="h3" size={1}>Setup</Heading>
              <Text size={1}>Template: {valueOrFallback(linkedData.template?.title)}</Text>
              <Text size={1}>Route base: {valueOrFallback(linkedData.template?.routeBase || program.routeBase)}</Text>
              <Text size={1}>Slug pattern: {valueOrFallback(linkedData.template?.slugPattern || program.slugPattern)}</Text>
              <Text size={1}>Dataset: {valueOrFallback(linkedData.dataset?.title)}</Text>
              <Text size={1}>Rows: {rows.length}</Text>
              <Text size={1}>Pages to generate: <strong>{rows.length}</strong></Text>
              {isLoadingLinkedData && <Text size={1}><Spinner muted /> Loading...</Text>}
            </Stack>
          </Card>

          <Card {...sectionCardProps}>
            <Stack space={3}>
              <Heading as="h3" size={1}>Preview Row ({selectedRowIndex + 1}/{rows.length})</Heading>
              {selectedRow && (
                <>
                  <Text size={1}>City: {selectedRow.city || "—"}</Text>
                  <Text size={1}>Service: {selectedRow.service || "—"}</Text>
                  <Text size={1}>Primary KW: {selectedRow.primaryKeyword}</Text>
                  <Text size={1}>Local: {selectedRow.localCondition?.slice(0, 80) || "—"}</Text>
                </>
              )}
              <Grid columns={2} gap={2}>
                <Button mode="ghost" disabled={selectedRowIndex === 0} onClick={() => setSelectedRowIndex((i) => Math.max(0, i - 1))} text="← Prev" />
                <Button mode="ghost" disabled={selectedRowIndex >= rows.length - 1} onClick={() => setSelectedRowIndex((i) => Math.min(rows.length - 1, i + 1))} text="Next →" />
              </Grid>
            </Stack>
          </Card>
        </Grid>

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>Preview Output</Heading>
            {previewDraft ? (
              <PreviewCard
                previewPath={`/${previewDraft.slug.current}`}
                seoTitle={previewDraft.meta?.title}
                seoDescription={previewDraft.meta?.description}
                status={previewStatus}
                draft={toPreviewDraftDetails(previewDraft)}
              />
            ) : (
              <Text size={1}>No preview available. Resolve blocking issues first.</Text>
            )}
          </Stack>
        </Card>

        <QaSummary qa={previewQa} />

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>Run</Heading>
            <Text size={1}>{rows.length} rows → {rows.length} pages. Dry run first, then generate drafts.</Text>
            <Grid columns={[1, 1, 2]} gap={3}>
              <Button disabled={hasBlockingIssues || activeAction === "write"} mode="ghost" onClick={handleDryRun} text={activeAction === "dry-run" ? "Running..." : `Dry Run (${rows.length} pages)`} />
              <Button disabled={hasBlockingIssues || activeAction === "dry-run"} tone="primary" onClick={() => { void handleGenerateDrafts(); }} text={activeAction === "write" ? "Generating..." : `Generate ${rows.length} Drafts`} />
            </Grid>
            <RunSummary summary={runSummary} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
