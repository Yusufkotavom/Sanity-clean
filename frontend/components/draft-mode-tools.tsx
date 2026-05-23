import { draftMode } from "next/headers";

export default async function DraftModeTools() {
  const isDraftMode = (await draftMode()).isEnabled;
  if (!isDraftMode) return null;

  // Only import heavy dependencies when draft mode is active
  const { SanityLive } = await import("@/sanity/lib/live");
  const { DisableDraftMode } = await import("@/components/disable-draft-mode");
  const { VisualEditing } = await import("next-sanity/visual-editing");

  return (
    <>
      <SanityLive />
      <DisableDraftMode />
      <VisualEditing />
    </>
  );
}
