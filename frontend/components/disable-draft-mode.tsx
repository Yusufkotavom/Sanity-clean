"use client";

import { useEffect, useState, useTransition } from "react";
import { useIsPresentationTool } from "next-sanity/hooks";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isPresentationTool = useIsPresentationTool();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleDisableDraftMode = async () => {
    setError(null);
    const response = await fetch("/api/draft-mode/disable", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      setError("Failed to disable draft mode");
      return;
    }
    window.location.reload();
  };

  // Hide when inside Presentation Tool or any Studio iframe pane
  if (isPresentationTool || isInIframe) return null;

  return (
    <>
      <button
        className={cn(
          buttonVariants({ size: "lg" }),
          "fixed z-9999 bottom-4 right-4 cursor-pointer",
        )}
        disabled={pending}
        onClick={() => startTransition(() => void handleDisableDraftMode())}
      >
        {pending ? "Disabling..." : "Disable Draft Mode"}
      </button>
      {error ? (
        <p className="fixed bottom-20 right-4 z-9999 rounded bg-destructive px-3 py-1 text-xs text-destructive-foreground">
          {error}
        </p>
      ) : null}
    </>
  );
}
