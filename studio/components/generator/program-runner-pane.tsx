import { useEffect, useMemo, useState, useRef } from "react";
import { Box, Button, Card, Code, Grid, Heading, Spinner, Stack, Text, Select } from "@sanity/ui";
import { useClient } from "sanity";
import { findDuplicatePage } from "../../lib/generator/dedupe";
import { assessGeneratedDraftQuality } from "../../lib/generator/qa";
import { buildGeneratedPageDraft } from "../../lib/generator/render";
import { buildGeneratedDraftId, buildGeneratedPageId } from "../../lib/generator/write";
import { parseCsvToRows } from "../../lib/generator/csv";
import { selectTemplateForRow } from "../../lib/generator/template-selection";
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
import { resolveAiPrompts, resolveAiPromptsSync } from "../../lib/generator/ai";

type GeneratorProgramValue = GeneratorProgramLite & {
  template?: ReferenceValue;
  templatePool?: ReferenceValue[];
  dataset?: ReferenceValue;
  generationMode?: string;
  status?: string;
  aiMode?: string;
  defaultSeoPattern?: { title?: string; description?: string };
};

type GeneratorDatasetDocument = GeneratorDatasetLite & {
  title?: string;
  slug?: SlugValue;
  rows?: GeneratorRow[];
  importMode?: string;
  rowCsv?: string;
};

type ProgramRunnerPaneProps = {
  documentId?: string;
  document?: { displayed?: Partial<GeneratorProgramValue> | null };
};

type LinkedGeneratorData = {
  template: GeneratorTemplateLite | null;
  templates: GeneratorTemplateLite[];
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

const TEMPLATES_QUERY = `*[_type == "generatorTemplate" && _id in $ids]{
  _id, title,
  routeBase, slugPattern, seoMeta, aggregateRatingDefaults,
  tokenDefinitions[]{_key, name, label, sourceField, fallbackValue, required},
  blocks
}`;

const DATASET_QUERY = `*[_type == "generatorDataset" && _id == $id][0]{
  _id, title, slug, importMode, rowCsv,
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
  const [linkedData, setLinkedData] = useState<LinkedGeneratorData>({ template: null, templates: [], dataset: null, existingPages: [] });
  const [isLoadingLinkedData, setIsLoadingLinkedData] = useState(false);
  const [linkedDataError, setLinkedDataError] = useState<string | null>(null);
  
  const [writeMode, setWriteMode] = useState<"skip" | "overwrite">("skip");
  const [batchLimit, setBatchLimit] = useState<number>(10);

  const [runSummary, setRunSummary] = useState<RunSummaryState>({
    generated: 0, skipped: 0, conflicts: 0, failed: 0,
    notes: ["Ready. Click 'Dry Run' to inspect all rows or 'Generate Drafts' to write."],
    mode: "idle",
  });
  const [activeAction, setActiveAction] = useState<"dry-run" | "write" | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const isCancelled = useRef(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    const legacyTemplateId = program.template?._ref;
    const poolTemplateIds = (program.templatePool ?? [])
      .map((reference) => reference?._ref)
      .filter((id): id is string => typeof id === "string" && id.length > 0)
      .slice(0, 3);
    const templateIds = poolTemplateIds.length > 0 ? poolTemplateIds : legacyTemplateId ? [legacyTemplateId] : [];
    const datasetId = program.dataset?._ref;
    if (templateIds.length === 0 || !datasetId) {
      setLinkedData({ template: null, templates: [], dataset: null, existingPages: [] });
      return;
    }
    let cancelled = false;
    const load = async () => {
      setIsLoadingLinkedData(true);
      setLinkedDataError(null);
      try {
        const [templates, dataset, existingPages] = await Promise.all([
          client.fetch<GeneratorTemplateLite[]>(TEMPLATES_QUERY, { ids: templateIds }),
          client.fetch<GeneratorDatasetDocument | null>(DATASET_QUERY, { id: datasetId }),
          client.fetch<ExistingPageLike[]>(EXISTING_PAGES_QUERY),
        ]);
        if (!cancelled) {
          const templatesById = new Map((templates ?? []).map((template) => [template._id, template]));
          const orderedTemplates = templateIds.flatMap((id) => {
            const template = templatesById.get(id);
            return template ? [template] : [];
          });
          setLinkedData({ template: orderedTemplates[0] ?? null, templates: orderedTemplates, dataset, existingPages: existingPages ?? [] });
        }
      } catch (error) {
        if (!cancelled) {
          setLinkedDataError(error instanceof Error ? error.message : "Fetch failed.");
          setLinkedData({ template: null, templates: [], dataset: null, existingPages: [] });
        }
      } finally {
        if (!cancelled) setIsLoadingLinkedData(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [client, program.dataset?._ref, program.template?._ref, program.templatePool]);

  const rows = useMemo(() => {
    const d = linkedData.dataset;
    if (!d) return [];
    if (d.importMode === "csv-ready" && d.rowCsv) {
      return parseCsvToRows(d.rowCsv);
    }
    return d.rows ?? [];
  }, [linkedData.dataset]);

  const selectedRow = rows[selectedRowIndex] || rows[0] || null;

  const programLite = useMemo<GeneratorProgramLite>(() => ({
    _id: program._id || documentId,
    routeBase: program.routeBase || "",
    slugPattern: program.slugPattern || undefined,
    slug: program.slug,
    title: program.title,
    ref: program._id ? { _type: "reference", _ref: program._id } : undefined,
    templatePool: program.templatePool,
    dataset: linkedData.dataset?._id ? { _id: linkedData.dataset._id, title: linkedData.dataset.title, slug: linkedData.dataset.slug } : undefined,
    defaultSeoPattern: program.defaultSeoPattern,
  }), [documentId, linkedData.dataset, program]);

  const activeTemplates = linkedData.templates.length > 0
    ? linkedData.templates
    : linkedData.template
      ? [linkedData.template]
      : [];

  const selectedTemplate = selectedRow
    ? selectTemplateForRow({ programId: programLite._id, row: selectedRow, templates: activeTemplates })
    : null;

  const previewDraft = useMemo<GeneratedPageDraft | null>(() => {
    if (!selectedTemplate || !selectedRow) return null;
    try {
      const rawDraft = buildGeneratedPageDraft({ program: programLite, template: selectedTemplate, row: selectedRow });
      return resolveAiPromptsSync(rawDraft);
    } catch { return null; }
  }, [programLite, selectedRow, selectedTemplate]);

  const previewQa = useMemo<GeneratorQaResult | null>(() => {
    if (!previewDraft || !selectedRow) return null;
    return assessGeneratedDraftQuality({ draft: previewDraft, keywordSet: { primaryKeyword: selectedRow.primaryKeyword, secondaryKeywords: selectedRow.secondaryKeywords }, row: selectedRow, existingPages: linkedData.existingPages, writeMode });
  }, [linkedData.existingPages, previewDraft, selectedRow, writeMode]);

  const previewStatus = useMemo<PreviewStatus>(() => {
    const blockingIssues: string[] = [];
    const notes: string[] = [];
    if (activeTemplates.length === 0) blockingIssues.push("Select at least one generator template.");
    if (!program.dataset?._ref) blockingIssues.push("Select a generator dataset.");
    if (program.status === "paused") blockingIssues.push("Program is paused.");
    if (program.status === "draft" && program.generationMode === "batch") blockingIssues.push("Program must be 'Ready' to run a Batch generation.");
    if (linkedDataError) blockingIssues.push(`Load error: ${linkedDataError}`);
    if (linkedData.dataset && !rows.length) blockingIssues.push("Dataset has no rows.");
    notes.push(`${rows.length} rows → ${batchLimit === 0 ? "All" : batchLimit} pages will be processed.`);
    notes.push(`Templates: ${activeTemplates.length}`);
    if (selectedTemplate?.title) notes.push(`Preview template: ${selectedTemplate.title}`);
    if (selectedTemplate?.routeBase) notes.push(`Route base: ${selectedTemplate.routeBase}`);
    return { blockingIssues, notes, mode: blockingIssues.length > 0 ? "blocked" : isLoadingLinkedData ? "loading" : "ready" };
  }, [activeTemplates.length, isLoadingLinkedData, linkedData.dataset, linkedDataError, program, rows.length, batchLimit, selectedTemplate]);

  const buildDryRunResult = (): DryRunResult => {
    if (!linkedData.dataset || activeTemplates.length === 0) throw new Error("Template and dataset must resolve.");
    const existingPages = [...linkedData.existingPages];
    const generatedDrafts: GeneratedDraftCandidate[] = [];
    let skipped = 0, conflicts = 0, failed = 0;
    const notes: string[] = [];

    const targetRows = 
      program.generationMode === "preview" 
        ? (selectedRow ? [selectedRow] : []) 
        : batchLimit === 0 ? rows : rows.slice(0, batchLimit);

    for (const row of targetRows) {
      try {
        const template = selectTemplateForRow({ programId: programLite._id, row, templates: activeTemplates });
        if (!template) { failed++; continue; }
        const draft = buildGeneratedPageDraft({ program: programLite, template, row });
        const duplicate = findDuplicatePage(existingPages, {
          slug: draft.slug.current, programId: draft.generator.programId,
          rowKey: draft.generator.rowKey, keywordKey: draft.generator.keywordKey,
        });
        const pageId = buildGeneratedPageId(draft.slug.current);
        if (duplicate && writeMode !== "overwrite") {
          skipped++;
          continue;
        }
        const qa = assessGeneratedDraftQuality({ draft, keywordSet: { primaryKeyword: row.primaryKeyword, secondaryKeywords: row.secondaryKeywords }, row, existingPages, writeMode });
        if (qa.severity === "blocked") { failed++; continue; }
        const draftDocumentId = buildGeneratedDraftId(draft.slug.current);
        generatedDrafts.push({ documentId: draftDocumentId, pageId, draft, qa });
        existingPages.push({ _id: draftDocumentId, title: draft.title, slug: draft.slug, generator: draft.generator });
      } catch { failed++; }
    }

    notes.push(`Inspected ${targetRows.length} rows (1 row = 1 page). Dedupe: ${writeMode === "overwrite" ? "Overwrite mode" : "Skip Existing"}.`);
    return {
      generatedDrafts,
      summary: { generated: generatedDrafts.length, skipped, conflicts, failed, notes, mode: failed > 0 ? "error" : "complete", combinationCount: targetRows.length, sampleSlug: previewDraft?.slug.current },
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
    isCancelled.current = false;
    setProgress(null);
    try {
      const dryRun = buildDryRunResult();
      const total = dryRun.generatedDrafts.length;
      setProgress({ current: 0, total });
      
      const written: string[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < total; i++) {
        if (isCancelled.current) {
          errors.push(`Process stopped by user at ${i}/${total}.`);
          break;
        }
        
        const c = dryRun.generatedDrafts[i];
        setProgress({ current: i + 1, total });
        
        try { 
          const finalDraft = await resolveAiPrompts(c.draft, { mode: "generate" });
          if (writeMode === "overwrite") {
            await client.createOrReplace({ _id: c.documentId, ...finalDraft });
          } else {
            await client.createIfNotExists({ _id: c.documentId, ...finalDraft }); 
          }
          written.push(c.pageId); 
        } catch (err: any) {
          console.error("Mutation failed for", c.documentId, err);
          errors.push(`Failed to write ${c.documentId}: ${err.message}`);
        }
      }
      setRunSummary({ 
        ...dryRun.summary, 
        generated: written.length, 
        failed: errors.length,
        notes: [
          ...dryRun.summary.notes, 
          `Created/Updated ${written.length} draft pages.`,
          ...errors
        ], 
        mode: errors.length > 0 ? "error" : "complete" 
      });
      if (written.length > 0) {
        setLinkedData((cur) => ({ ...cur, existingPages: [...cur.existingPages, ...dryRun.generatedDrafts.filter((c) => written.includes(c.pageId)).map((c) => ({ _id: c.documentId, title: c.draft.title, slug: c.draft.slug, generator: c.draft.generator }))] }));
      }
    } catch (e) { setRunSummary({ generated: 0, skipped: 0, conflicts: 0, failed: 1, notes: [e instanceof Error ? e.message : "Write failed."], mode: "error" }); }
    finally { 
      setActiveAction(null); 
      setProgress(null);
    }
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
              <Text size={1}>Template: {activeTemplates.length > 1 ? `${activeTemplates.length} templates in pool` : valueOrFallback(activeTemplates[0]?.title)}</Text>
              {selectedTemplate?.title && <Text size={1}>Preview Template: {selectedTemplate.title}</Text>}
              <Text size={1}>Route base: {valueOrFallback(selectedTemplate?.routeBase || program.routeBase)}</Text>
              <Text size={1}>Slug pattern: {valueOrFallback(selectedTemplate?.slugPattern || program.slugPattern)}</Text>
              <Text size={1}>Dataset: {valueOrFallback(linkedData.dataset?.title)}</Text>
              <Text size={1}>Total Rows in Dataset: {rows.length}</Text>
              {isLoadingLinkedData && <Text size={1}><Spinner muted /> Loading...</Text>}
            </Stack>
          </Card>

          <Card {...sectionCardProps}>
            <Stack space={3}>
              <Heading as="h3" size={1}>Options</Heading>
              
              <Stack space={2}>
                <Text size={1} weight="semibold">Write Mode</Text>
                <Select value={writeMode} onChange={(e) => setWriteMode(e.currentTarget.value as "skip" | "overwrite")}>
                  <option value="skip">Safe (Skip Existing)</option>
                  <option value="overwrite">Overwrite Existing</option>
                </Select>
                <Text muted size={1}>
                  {writeMode === "skip" ? "Safe: Will not overwrite manually edited pages." : "Overwrite: Warning! This will replace existing drafts."}
                </Text>
              </Stack>

              <Stack space={2}>
                <Text size={1} weight="semibold">Batch Limit</Text>
                <Select value={batchLimit} onChange={(e) => setBatchLimit(Number(e.currentTarget.value))}>
                  <option value="10">First 10 rows</option>
                  <option value="20">First 20 rows</option>
                  <option value="50">First 50 rows</option>
                  <option value="100">First 100 rows</option>
                  <option value="200">First 200 rows</option>
                  <option value="500">First 500 rows</option>
                  <option value="0">All rows</option>
                </Select>
                <Text muted size={1}>Process up to {batchLimit === 0 ? "all" : batchLimit} rows at once.</Text>
              </Stack>
            </Stack>
          </Card>
        </Grid>

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
            <Text size={1}>Target: {batchLimit === 0 ? "All" : batchLimit} rows. Dry run first, then generate drafts.</Text>
            <Grid columns={[1, 1, activeAction === "write" ? 3 : 2]} gap={3}>
              <Button disabled={hasBlockingIssues || activeAction === "write"} mode="ghost" onClick={handleDryRun} text={activeAction === "dry-run" ? "Running..." : `Dry Run (${batchLimit === 0 ? "All" : batchLimit} pages)`} />
              <Button disabled={hasBlockingIssues || activeAction === "dry-run"} tone="primary" onClick={() => { void handleGenerateDrafts(); }} text={activeAction === "write" ? (progress ? `Generating ${progress.current}/${progress.total}...` : "Generating...") : `Generate Drafts`} />
              {activeAction === "write" && (
                <Button tone="critical" mode="ghost" onClick={() => { isCancelled.current = true; }} text="Stop / Pause" />
              )}
            </Grid>
            <RunSummary summary={runSummary} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
