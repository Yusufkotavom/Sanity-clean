import { Badge, Box, Card, Code, Flex, Grid, Heading, Stack, Text } from "@sanity/ui";

export type PreviewStatus = {
  blockingIssues: string[];
  notes: string[];
  mode?: "loading" | "ready" | "blocked" | "error";
};

export type PreviewDraftDetails = {
  title: string;
  slug: string;
  blockCount: number;
  blockTypes: string[];
  generator: {
    programId: string;
    templateId: string;
    datasetId?: string;
    rowKey: string;
    keywordKey: string;
    version: string;
  };
};

type PreviewSelection = {
  templateTitle?: string;
  datasetTitle?: string;
  keywordSetLabel?: string;
  rowLabel?: string;
  primaryKeyword?: string;
  angle?: string;
  service?: string;
  city?: string;
  offer?: string;
  combinationCount?: number;
};

type PreviewCardProps = {
  previewPath: string;
  seoTitle?: string;
  seoDescription?: string;
  status: PreviewStatus;
  draft?: PreviewDraftDetails;
  selection?: PreviewSelection;
};

const resolveBadgeTone = (mode: PreviewStatus["mode"], hasBlockingIssues: boolean) => {
  if (mode === "loading") return "primary" as const;
  if (mode === "error") return "critical" as const;
  if (hasBlockingIssues || mode === "blocked") return "caution" as const;
  return "positive" as const;
};

const resolveBadgeLabel = (mode: PreviewStatus["mode"], hasBlockingIssues: boolean, hasDraft: boolean) => {
  if (mode === "loading") return "Loading";
  if (mode === "error") return "Error";
  if (hasBlockingIssues || mode === "blocked") return "Blocked";
  if (hasDraft) return "Draft Ready";
  return "Ready";
};

export function PreviewCard({
  previewPath,
  seoTitle,
  seoDescription,
  status,
  draft,
  selection,
}: PreviewCardProps) {
  const hasBlockingIssues = status.blockingIssues.length > 0;
  const hasSeoPattern = Boolean(seoTitle || seoDescription);
  const hasNotes = status.notes.length > 0;
  const badgeTone = resolveBadgeTone(status.mode, hasBlockingIssues);
  const badgeLabel = resolveBadgeLabel(status.mode, hasBlockingIssues, Boolean(draft));

  return (
    <Card border padding={4} radius={3} tone="transparent">
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Heading as="h4" size={1}>
            Preview Card
          </Heading>
          <Badge tone={badgeTone}>{badgeLabel}</Badge>
        </Flex>

        <Stack space={3}>
          <Box>
            <Text muted size={1}>
              Preview path
            </Text>
            <Code size={1}>{previewPath}</Code>
          </Box>

          {selection ? (
            <Box>
              <Text muted size={1}>
                Preview input
              </Text>
              <Grid columns={[1, 1, 2]} gap={3} marginTop={2}>
                <Card border padding={3} radius={2}>
                  <Stack space={2}>
                    <Text muted size={1}>
                      Template / Dataset
                    </Text>
                    <Text size={1}>Template: {selection.templateTitle || "Missing"}</Text>
                    <Text size={1}>Dataset: {selection.datasetTitle || "Missing"}</Text>
                    <Text size={1}>
                      Kombinasi tersedia: {typeof selection.combinationCount === "number" ? selection.combinationCount : "Unknown"}
                    </Text>
                  </Stack>
                </Card>
                <Card border padding={3} radius={2}>
                  <Stack space={2}>
                    <Text muted size={1}>
                      Keyword / Row
                    </Text>
                    <Text size={1}>Keyword set: {selection.keywordSetLabel || "Missing"}</Text>
                    <Text size={1}>Row: {selection.rowLabel || "Missing"}</Text>
                    <Text size={1}>Primary keyword: {selection.primaryKeyword || "Missing"}</Text>
                    <Text size={1}>Angle: {selection.angle || "Not set"}</Text>
                    <Text size={1}>Service: {selection.service || "Not set"}</Text>
                    <Text size={1}>City: {selection.city || "Not set"}</Text>
                    <Text size={1}>Offer: {selection.offer || "Not set"}</Text>
                  </Stack>
                </Card>
              </Grid>
            </Box>
          ) : null}

          <Box>
            <Text muted size={1}>
              SEO title pattern
            </Text>
            <Text size={1}>{seoTitle || "Missing"}</Text>
          </Box>
          <Box>
            <Text muted size={1}>
              SEO description pattern
            </Text>
            <Text size={1}>{seoDescription || "Missing"}</Text>
          </Box>

          {draft ? (
            <Box>
              <Text muted size={1}>
                Deterministic draft
              </Text>
              <Stack as="ul" space={2} marginTop={2}>
                <Text as="li" size={1}>
                  Title: {draft.title}
                </Text>
                <Text as="li" size={1}>
                  Slug: <Code size={1}>{draft.slug}</Code>
                </Text>
                <Text as="li" size={1}>
                  Blocks: {draft.blockCount}
                </Text>
                <Text as="li" size={1}>
                  Block types: {draft.blockTypes.join(", ") || "None"}
                </Text>
                <Text as="li" size={1}>
                  Generator lineage: {draft.generator.programId} / {draft.generator.templateId}
                  {draft.generator.datasetId ? ` / ${draft.generator.datasetId}` : ""}
                </Text>
                <Text as="li" size={1}>
                  Row key / keyword key: {draft.generator.rowKey} / {draft.generator.keywordKey}
                </Text>
              </Stack>
            </Box>
          ) : null}

          <Box>
            <Text muted size={1}>
              Blocking issues
            </Text>
            <Stack as="ul" space={2} marginTop={2}>
              {hasBlockingIssues ? (
                status.blockingIssues.map((message) => (
                  <Text as="li" key={message} size={1}>
                    {message}
                  </Text>
                ))
              ) : (
                <Text as="li" size={1}>
                  No blocking setup issues detected in the current document shape.
                </Text>
              )}
            </Stack>
          </Box>
          <Box>
            <Text muted size={1}>
              Notes
            </Text>
            <Stack as="ul" space={2} marginTop={2}>
              {!hasSeoPattern ? (
                <Text as="li" size={1}>
                  SEO patterns are incomplete, so preview metadata remains partially unresolved.
                </Text>
              ) : null}
              {hasNotes
                ? status.notes.map((note) => (
                    <Text as="li" key={note} size={1}>
                      {note}
                    </Text>
                  ))
                : null}
              {!hasSeoPattern && !hasNotes ? (
                <Text as="li" size={1}>
                  Deterministic preview assembly is ready once template, dataset, and first-row inputs resolve.
                </Text>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
