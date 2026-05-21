import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { fetchSanitySeoSettings, fetchSanitySettings } from "@/sanity/lib/fetch";

export const runtime = "edge";

const DEFAULTS = {
  gradientFrom: "#0B1220",
  gradientTo: "#1E293B",
  accent: "#22D3EE",
  text: "#FFFFFF",
  eyebrow: "KotaCom",
};

const MAX_TITLE = 140;

const clampTitle = (value: string) => {
  const clean = value.trim();
  if (clean.length <= MAX_TITLE) return clean;
  return `${clean.slice(0, MAX_TITLE - 1)}…`;
};

const normalizeHex = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return fallback;
  return normalized;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") || "";
  const title = clampTitle(rawTitle || "KotaCom");
  const badge = searchParams.get("badge") || "";

  const [seoSettings, siteSettings] = await Promise.all([
    fetchSanitySeoSettings().catch(() => null),
    fetchSanitySettings().catch(() => null),
  ]);

  const siteName =
    (siteSettings as { siteName?: string; brandName?: string } | null)?.siteName ||
    (siteSettings as { siteName?: string; brandName?: string } | null)?.brandName ||
    "KotaCom";
  const siteUrl = (seoSettings as { siteUrl?: string } | null)?.siteUrl || "";
  const domain = siteUrl ? new URL(siteUrl).hostname : "kotacom.id";

  const ogTheme = (seoSettings as { ogTheme?: any } | null)?.ogTheme || {};
  const gradientFrom = normalizeHex(ogTheme.gradientFrom, DEFAULTS.gradientFrom);
  const gradientTo = normalizeHex(ogTheme.gradientTo, DEFAULTS.gradientTo);
  const accent = normalizeHex(ogTheme.accentColor, DEFAULTS.accent);
  const textColor = normalizeHex(ogTheme.textColor, DEFAULTS.text);
  const eyebrow =
    (typeof ogTheme.eyebrow === "string" && ogTheme.eyebrow.trim()) || DEFAULTS.eyebrow;

  const fontSize = title.length > 100 ? 52 : title.length > 60 ? 66 : 82;
  const badgeText = badge || (typeof ogTheme.defaultBadge === "string" ? ogTheme.defaultBadge : "");

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          color: textColor,
          backgroundImage: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "999px", backgroundColor: accent }} />
            <span style={{ fontSize: "28px", opacity: 0.95 }}>{eyebrow}</span>
          </div>
          {badgeText ? (
            <div
              style={{
                fontSize: "22px",
                border: `1px solid ${accent}`,
                borderRadius: "999px",
                padding: "8px 18px",
                opacity: 0.95,
              }}
            >
              {badgeText}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "28px",
            fontSize: "24px",
            opacity: 0.92,
          }}
        >
          <span>{siteName}</span>
          <span>{domain}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );

  image.headers.set("Access-Control-Allow-Origin", "*");
  image.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  image.headers.set("Access-Control-Allow-Headers", "Content-Type");
  image.headers.set("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");
  return image;
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
