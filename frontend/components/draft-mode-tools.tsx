import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";

export default async function DraftModeTools() {
  const isDraftMode = (await draftMode()).isEnabled;
  if (!isDraftMode) return null;
  return (
    <>
      <SanityLive />
      <DisableDraftMode />
      <VisualEditing />
    </>
  );
}
