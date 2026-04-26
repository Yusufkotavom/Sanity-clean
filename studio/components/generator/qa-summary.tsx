import { Badge, Card, Grid, Heading, Stack, Text } from "@sanity/ui";
import type { GeneratorQaResult } from "../../lib/generator/types";

type QaSummaryProps = {
  qa: GeneratorQaResult | null;
};

const resolveTone = (severity?: GeneratorQaResult["severity"]) => {
  if (!severity) return "default" as const;
  if (severity === "blocked") return "critical" as const;
  if (severity === "warning") return "caution" as const;
  return "positive" as const;
};

const resolveLabel = (severity?: GeneratorQaResult["severity"]) => {
  if (!severity) return "Pending";
  if (severity === "blocked") return "Blocked";
  if (severity === "warning") return "Warning";
  return "Ready";
};

export function QaSummary({ qa }: QaSummaryProps) {
  const blocked = qa?.issues.filter((item) => item.severity === "blocked").length ?? 0;
  const warnings = qa?.issues.filter((item) => item.severity === "warning").length ?? 0;
  const ready = qa && qa.issues.length === 0;

  return (
    <Card border padding={4} radius={3} tone="transparent">
      <Stack space={4}>
        <Stack space={2}>
          <Heading as="h4" size={1}>
            QA Check
          </Heading>
          <Badge tone={resolveTone(qa?.severity)}>{resolveLabel(qa?.severity)}</Badge>
        </Stack>

        <Grid columns={[3, 3, 3]} gap={3}>
          <Card border padding={3} radius={2}>
            <Stack space={2}>
              <Badge tone="positive">Ready</Badge>
              <Text size={3} weight="semibold">
                {ready ? 1 : 0}
              </Text>
            </Stack>
          </Card>
          <Card border padding={3} radius={2}>
            <Stack space={2}>
              <Badge tone="caution">Warnings</Badge>
              <Text size={3} weight="semibold">
                {warnings}
              </Text>
            </Stack>
          </Card>
          <Card border padding={3} radius={2}>
            <Stack space={2}>
              <Badge tone="critical">Blocked</Badge>
              <Text size={3} weight="semibold">
                {blocked}
              </Text>
            </Stack>
          </Card>
        </Grid>

        <Stack as="ul" space={2}>
          {qa?.issues.length ? (
            qa.issues.map((issue) => (
              <Text as="li" key={`${issue.code}-${issue.message}`} size={1}>
                [{issue.severity}] {issue.message}
              </Text>
            ))
          ) : qa ? (
            <Text as="li" size={1}>
              Selected draft passed the current generator QA checks.
            </Text>
          ) : (
            <Text as="li" size={1}>
              QA will appear after the selected preview draft is available.
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
