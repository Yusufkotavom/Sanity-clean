import { useMemo } from "react";
import { Box, Button, Card, Code, Grid, Heading, Stack, Text } from "@sanity/ui";
import { PreviewCard, type PreviewStatus } from "./preview-card";
import { RunSummary, type RunSummaryState } from "./run-summary";

type ReferenceValue = {
  _ref?: string;
};

type SlugValue = {
  current?: string;
};

type SeoPatternValue = {
  title?: string;
  description?: string;
};

type GeneratorProgramValue = {
  _id?: string;
  title?: string;
  slug?: SlugValue;
  template?: ReferenceValue;
  dataset?: ReferenceValue;
  programType?: string;
  generationMode?: string;
  routeBase?: string;
  status?: string;
  aiMode?: string;
  defaultSeoPattern?: SeoPatternValue;
};

type ProgramRunnerPaneProps = {
  documentId?: string;
  document?: {
    displayed?: Partial<GeneratorProgramValue> | null;
  };
};

const sectionCardProps = {
  border: true,
  padding: 4,
  radius: 3,
  tone: "transparent" as const,
};

const formatLabel = (value?: string) =>
  value
    ? value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not set";

const valueOrFallback = (value?: string) => value || "Not set";

export function ProgramRunnerPane(props: ProgramRunnerPaneProps) {
  const program = props.document?.displayed ?? {};
  const documentId = props.documentId || program._id || "unknown";

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

    if (!program.defaultSeoPattern?.title) {
      notes.push("Default SEO title pattern is empty.");
    }

    if (!program.defaultSeoPattern?.description) {
      notes.push("Default SEO description pattern is empty.");
    }

    notes.push("Dataset rows and keyword sets will be loaded into this pane in Task 3.");

    return { blockingIssues, notes };
  }, [
    program.dataset?._ref,
    program.defaultSeoPattern?.description,
    program.defaultSeoPattern?.title,
    program.routeBase,
    program.template?._ref,
    program.title,
  ]);

  const previewPath = useMemo(() => {
    if (!program.routeBase || !program.slug?.current) {
      return undefined;
    }

    return program.routeBase === "/" ? `/${program.slug.current}` : `${program.routeBase}/${program.slug.current}`;
  }, [program.routeBase, program.slug?.current]);

  const runSummary = useMemo<RunSummaryState>(
    () => ({
      generated: 0,
      skipped: 0,
      conflicts: 0,
      failed: 0,
      notes: [
        "No run has been started from Studio yet.",
        "Future tasks will connect deterministic preview assembly and draft page writes.",
      ],
    }),
    [],
  );

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={2}>
          <Heading as="h2" size={2}>
            Generator Run
          </Heading>
          <Text muted size={1}>
            Minimal operator pane for Task 2. Deterministic preview and write actions are deferred.
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
              <Text size={1}>
                Dataset rows and keyword sets will be loaded into this pane in a later task. This pass only confirms
                the selected document wiring.
              </Text>
            </Stack>
          </Card>
        </Grid>

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>
              Preview
            </Heading>
            <PreviewCard
              previewPath={previewPath || "Unavailable until route base and slug are set"}
              seoTitle={program.defaultSeoPattern?.title}
              seoDescription={program.defaultSeoPattern?.description}
              status={previewStatus}
            />
          </Stack>
        </Card>

        <Card {...sectionCardProps}>
          <Stack space={3}>
            <Heading as="h3" size={1}>
              Run
            </Heading>
            <Text size={1}>
              No generator runtime is attached yet. This pane is intentionally limited to setup visibility for the next
              implementation task.
            </Text>
            <Button disabled mode="ghost" text="Run generator (coming later)" />
            <RunSummary summary={runSummary} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
