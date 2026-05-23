import { draftMode } from "next/headers";

export default async function DraftModeTools() {
  const isDraftMode = (await draftMode()).isEnabled;
  if (!isDraftMode) return null;

  const { DisableDraftMode } = await import("@/components/disable-draft-mode");

  return <DisableDraftMode />;
}
