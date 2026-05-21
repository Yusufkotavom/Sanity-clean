import { useState } from "react";
import type { DocumentActionComponent, SanityDocumentLike } from "sanity";
import { useClient } from "sanity";
import { useToast } from "@sanity/ui";

type PostDoc = SanityDocumentLike & {
  title?: string;
  slug?: { current?: string };
  image?: unknown;
  meta?: {
    title?: string;
    image?: unknown;
  };
};

const buildOgUrl = (baseUrl: string, title: string) => {
  const params = new URLSearchParams({
    title,
    badge: "Blog",
  });
  return `${baseUrl.replace(/\/+$/, "")}/api/og?${params.toString()}`;
};

const STATIC_OG_BASE_FALLBACKS = ["https://api.devk.my.id", "http://localhost:3002"];

export const generatePostOgAction: DocumentActionComponent = (props) => {
  const { id, draft, published, onComplete } = props;
  const client = useClient({ apiVersion: "2026-03-23" });
  const toast = useToast();
  const [running, setRunning] = useState(false);

  const source = (draft || published) as PostDoc | null;
  const docTitle = source?.meta?.title || source?.title || "";
  const slug = source?.slug?.current || id.replace(/^drafts\./, "");
  const hasOg = Boolean(source?.meta?.image);

  return {
    label: hasOg ? "Regenerate OG Image" : "Generate OG Image",
    disabled: running || !source || !docTitle,
    onHandle: async () => {
      if (!source || !docTitle) {
        toast.push({
          status: "warning",
          title: "OG image cannot be generated",
          description: "Title is required before generating OG image.",
        });
        onComplete();
        return;
      }

      setRunning(true);
      try {
        const studioHost =
          typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
        const studioIsLocal =
          studioHost === "localhost" ||
          studioHost === "127.0.0.1" ||
          studioHost === "::1";

        const seoSettings = await client.fetch<{ siteUrl?: string } | null>(
          `*[_type == "seoSettings"][0]{siteUrl}`,
        );
        const baseCandidates = [
          ...STATIC_OG_BASE_FALLBACKS,
          process.env.SANITY_STUDIO_FRONTEND_URL,
          process.env.SANITY_STUDIO_PREVIEW_URL,
          seoSettings?.siteUrl,
        ]
          .map((value) => (typeof value === "string" ? value.trim() : ""))
          .filter((value) => Boolean(value))
          .filter((value) => !/^https?:\/\/localhost:3000\/?$/i.test(value))
          .filter((value) => {
            if (studioIsLocal) return true;
            return !/^https?:\/\/localhost(?::\d+)?\/?$/i.test(value);
          });
        const uniqueBases = Array.from(new Set(baseCandidates));

        if (uniqueBases.length === 0) {
          throw new Error(
            "No frontend base URL configured. Set SANITY_STUDIO_FRONTEND_URL or SANITY_STUDIO_PREVIEW_URL.",
          );
        }

        let blob: Blob | null = null;
        let resolvedUrl = "";
        let lastError = "";

        for (const baseUrl of uniqueBases) {
          const ogUrl = buildOgUrl(baseUrl, docTitle);
          try {
            const response = await fetch(ogUrl, {
              method: "GET",
              mode: "cors",
              credentials: "omit",
            });
            if (!response.ok) {
              lastError = `${ogUrl} returned ${response.status}`;
              continue;
            }

            const contentType = response.headers.get("content-type") || "";
            if (!contentType.toLowerCase().startsWith("image/")) {
              lastError = `${ogUrl} returned non-image content-type (${contentType || "unknown"})`;
              continue;
            }

            blob = await response.blob();
            resolvedUrl = ogUrl;
            break;
          } catch (error) {
            lastError = `${ogUrl} failed: ${error instanceof Error ? error.message : "unknown error"}`;
          }
        }

        if (!blob || !resolvedUrl) {
          throw new Error(lastError || "Failed to fetch OG image from all configured URLs.");
        }
        const fileName = `og-post-${slug}-${Date.now()}.png`;
        const asset = await client.assets.upload("image", blob, {
          filename: fileName,
          contentType: "image/png",
        });

        const normalizedId = id.replace(/^drafts\./, "");
        const targetId = draft ? `drafts.${normalizedId}` : normalizedId;
        const patchPayload: Record<string, unknown> = {
          "meta.image": {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
            alt: `${docTitle} - OG image`,
          },
          "meta.ogGeneratedAt": new Date().toISOString(),
          "meta.ogGenerationSource": "studio-generate-action",
        };

        if (!source.image) {
          patchPayload.image = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
            alt: `${docTitle} - Featured image`,
          };
        }

        await client
          .patch(targetId)
          .set(patchPayload)
          .commit({ autoGenerateArrayKeys: true });

        toast.push({
          status: "success",
          title: "OG image generated",
          description: `Image generated from ${resolvedUrl} and saved to meta.image.`,
        });
      } catch (error) {
        toast.push({
          status: "error",
          title: "Failed to generate OG image",
          description: error instanceof Error ? error.message : "Unknown error.",
        });
      } finally {
        setRunning(false);
        onComplete();
      }
    },
  };
};
