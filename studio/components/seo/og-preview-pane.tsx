import { useMemo, useState } from "react";
import { Box, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";

const FRONTEND_URL = (
  process.env.SANITY_STUDIO_FRONTEND_URL ||
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  "https://api.devk.my.id"
)
  .trim()
  .replace(/\/+$/, "");

type PaneProps = {
  document?: {
    displayed?: {
      ogTheme?: {
        defaultBadge?: string;
      };
    };
  };
};

export function OgPreviewPane(props: PaneProps) {
  const defaultBadge = props?.document?.displayed?.ogTheme?.defaultBadge || "Insights";
  const [title, setTitle] = useState("Contoh Judul OG KotaCom");
  const [badge, setBadge] = useState(defaultBadge);

  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      title,
      badge,
    });
    return `${FRONTEND_URL}/api/og?${params.toString()}`;
  }, [badge, title]);

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          OG Image Live Preview
        </Text>

        <Flex gap={3}>
          <Box flex={3}>
            <Text size={1} muted>
              Title
            </Text>
            <TextInput
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="Masukkan judul preview"
            />
          </Box>
          <Box flex={1}>
            <Text size={1} muted>
              Badge
            </Text>
            <TextInput
              value={badge}
              onChange={(event) => setBadge(event.currentTarget.value)}
              placeholder="Blog"
            />
          </Box>
        </Flex>

        <Text size={1} muted>
          URL: {previewUrl}
        </Text>

        <Card
          radius={2}
          style={{
            width: "100%",
            aspectRatio: "1200 / 630",
            overflow: "hidden",
            border: "1px solid var(--card-border-color)",
          }}
        >
          <iframe
            title="OG Preview"
            src={previewUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "0",
              background: "#111827",
            }}
          />
        </Card>
      </Stack>
    </Card>
  );
}
