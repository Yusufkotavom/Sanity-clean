import { Badge, Box, Card, Code, Flex, Heading, Stack, Text } from "@sanity/ui";

export type PreviewStatus = {
  blockingIssues: string[];
  notes: string[];
};

type PreviewCardProps = {
  previewPath: string;
  seoTitle?: string;
  seoDescription?: string;
  status: PreviewStatus;
};

export function PreviewCard({
  previewPath,
  seoTitle,
  seoDescription,
  status,
}: PreviewCardProps) {
  const hasBlockingIssues = status.blockingIssues.length > 0;
  const hasSeoPattern = Boolean(seoTitle || seoDescription);
  const hasNotes = status.notes.length > 0;

  return (
    <Card border padding={4} radius={3} tone="transparent">
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Heading as="h4" size={1}>
            Preview Card
          </Heading>
          <Badge tone={hasBlockingIssues ? "caution" : "positive"}>
            {hasBlockingIssues ? "Blocked" : "Ready for Task 3 wiring"}
          </Badge>
        </Flex>

        <Stack space={3}>
          <Box>
            <Text muted size={1}>
              Preview path
            </Text>
            <Code size={1}>{previewPath}</Code>
          </Box>
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
                  SEO patterns are incomplete, so Task 3 preview output should treat metadata as unresolved.
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
                  Deterministic preview assembly lands in Task 3 after metadata and dataset wiring are in place.
                </Text>
              ) : null}
              {hasSeoPattern && !hasNotes ? (
                <Text as="li" size={1}>
                  Minimal program inputs are present. Deterministic preview assembly lands in Task 3.
                </Text>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
