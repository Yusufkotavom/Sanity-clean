import { draftMode } from "next/headers";

export default async function DraftModeTools() {
  const isDraftMode = (await draftMode()).isEnabled;
  if (!isDraftMode) return null;

  const visualEditingEnabled = process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING !== "false";
  const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);
  const { DisableDraftMode } = await import("@/components/disable-draft-mode");

  if (!visualEditingEnabled || !hasReadToken) {
    return <DisableDraftMode />;
  }

  const [{ SanityLive }, { VisualEditing }] = await Promise.all([
    import("@/sanity/lib/live"),
    import("next-sanity/visual-editing"),
  ]);

  return (
    <>
      <DisableDraftMode />
      <SanityLive />
      <VisualEditing />
    </>
  );
}
