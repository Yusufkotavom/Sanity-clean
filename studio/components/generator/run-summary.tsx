import { Badge, Card, Grid, Heading, Stack, Text } from "@sanity/ui";

export type RunSummaryState = {
  generated: number;
  skipped: number;
  conflicts: number;
  failed: number;
  notes: string[];
  mode?: "idle" | "running" | "complete" | "error";
  combinationCount?: number;
  sampleSlug?: string;
};

type RunSummaryProps = {
  summary: RunSummaryState;
};

type SummaryKey = "generated" | "skipped" | "conflicts" | "failed";

const summaryItems = [
  { key: "generated", label: "Generated", tone: "positive" as const },
  { key: "skipped", label: "Skipped", tone: "primary" as const },
  { key: "conflicts", label: "Conflicts", tone: "caution" as const },
  { key: "failed", label: "Failed", tone: "critical" as const },
] satisfies Array<{ key: SummaryKey; label: string; tone: "positive" | "primary" | "caution" | "critical" }>;

const resolveModeTone = (mode: RunSummaryState["mode"]) => {
  if (mode === "running") return "primary" as const;
  if (mode === "error") return "critical" as const;
  if (mode === "complete") return "positive" as const;
  return "default" as const;
};

const resolveModeLabel = (mode: RunSummaryState["mode"]) => {
  if (mode === "running") return "Dry Run Active";
  if (mode === "error") return "Dry Run Error";
  if (mode === "complete") return "Dry Run Complete";
  return "Dry Run Idle";
};

export function RunSummary({ summary }: RunSummaryProps) {
  return (
    <Card border padding={4} radius={3} tone="transparent">
      <Stack space={4}>
        <Stack space={2}>
          <Heading as="h4" size={1}>
            Run Summary
          </Heading>
          <Badge tone={resolveModeTone(summary.mode)}>{resolveModeLabel(summary.mode)}</Badge>
          {typeof summary.combinationCount === "number" ? (
            <Text size={1}>Combinations inspected: {summary.combinationCount}</Text>
          ) : null}
          {summary.sampleSlug ? <Text size={1}>Current preview slug: {summary.sampleSlug}</Text> : null}
        </Stack>

        <Grid columns={[2, 2, 4]} gap={3}>
          {summaryItems.map((item) => (
            <Card key={item.key} border padding={3} radius={2}>
              <Stack space={2}>
                <Badge tone={item.tone}>{item.label}</Badge>
                <Text size={3} weight="semibold">
                  {summary[item.key]}
                </Text>
              </Stack>
            </Card>
          ))}
        </Grid>

        <Stack as="ul" space={2}>
          {summary.notes.map((note) => (
            <Text as="li" key={note} size={1}>
              {note}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
