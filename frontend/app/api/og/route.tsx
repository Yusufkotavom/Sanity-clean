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
  fontFamily: "Inter",
};

const clampTitle = (value: string, maxLength: number) => {
  const clean = value.trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(1, maxLength - 1))}…`;
};

const normalizeHex = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return fallback;
  return normalized;
};

const normalizeNumber = (
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

const withHexOpacity = (hex: string, opacity: number) => {
  const c = normalizeHex(hex, "#FFFFFF");
  const o = normalizeNumber(opacity, 1, 0, 1);
  const expanded =
    c.length === 4
      ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`
      : c;
  const n = parseInt(expanded.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${o})`;
};

const normalizeFontUrl = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) return "";
  return trimmed;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") || "";
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
  const maxTitle = normalizeNumber(ogTheme.titleMaxLength, 140, 40, 220);
  const title = clampTitle(rawTitle || "KotaCom", maxTitle);
  const gradientFrom = normalizeHex(ogTheme.gradientFrom, DEFAULTS.gradientFrom);
  const gradientTo = normalizeHex(ogTheme.gradientTo, DEFAULTS.gradientTo);
  const accent = normalizeHex(ogTheme.accentColor, DEFAULTS.accent);
  const textColor = normalizeHex(ogTheme.textColor, DEFAULTS.text);
  const footerBorderColor = normalizeHex(ogTheme.footerBorderColor, "#FFFFFF");
  const footerBorderOpacity = normalizeNumber(ogTheme.footerBorderOpacity, 0.18, 0, 1);
  const eyebrow =
    (typeof ogTheme.eyebrow === "string" && ogTheme.eyebrow.trim()) || DEFAULTS.eyebrow;
  const fontFamily =
    (typeof ogTheme.fontFamily === "string" && ogTheme.fontFamily.trim()) || DEFAULTS.fontFamily;
  const fontUrl = normalizeFontUrl(ogTheme.fontUrl);

  const canvasPaddingX = normalizeNumber(ogTheme.canvasPaddingX, 76, 24, 180);
  const canvasPaddingY = normalizeNumber(ogTheme.canvasPaddingY, 68, 24, 180);
  const headerDotSize = normalizeNumber(ogTheme.headerDotSize, 10, 4, 24);
  const badgeBorderWidth = normalizeNumber(ogTheme.badgeBorderWidth, 1, 0, 8);
  const badgeBorderRadius = normalizeNumber(ogTheme.badgeBorderRadius, 999, 0, 999);
  const titleFontSize = normalizeNumber(ogTheme.titleFontSize, 82, 32, 120);
  const titleLineHeight = normalizeNumber(ogTheme.titleLineHeight, 1.08, 0.9, 1.6);
  const titleLetterSpacing = normalizeNumber(ogTheme.titleLetterSpacingEm, -0.03, -0.2, 0.2);
  const titleClampLines = normalizeNumber(ogTheme.titleClampLines, 3, 1, 5);
  const overlayEnabled = Boolean(ogTheme.overlayEnabled ?? true);
  const overlayOpacity = normalizeNumber(ogTheme.overlayOpacity, 0.12, 0, 1);

  const computedFontSize =
    title.length > 100 ? Math.max(32, titleFontSize - 24) : title.length > 60 ? Math.max(32, titleFontSize - 16) : titleFontSize;
  const badgeText = badge || (typeof ogTheme.defaultBadge === "string" ? ogTheme.defaultBadge : "");

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style?: "normal" | "italic";
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  }> = [];
  if (fontUrl) {
    try {
      const data = await fetch(fontUrl).then((res) => {
        if (!res.ok) throw new Error(`font fetch failed: ${res.status}`);
        return res.arrayBuffer();
      });
      fonts.push({
        name: fontFamily,
        data,
        style: "normal",
        weight: 600,
      });
    } catch {
      // fallback to system fonts when remote font is unavailable
    }
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          padding: `${canvasPaddingY}px ${canvasPaddingX}px`,
          color: textColor,
          backgroundImage: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          fontFamily: `${fontFamily}, system-ui, sans-serif`,
        }}
      >
        {overlayEnabled ? (
          <div
            style={{
              position: "absolute",
              inset: "0",
              backgroundImage: `radial-gradient(circle at 14% 15%, ${withHexOpacity(accent, overlayOpacity)} 0%, transparent 44%)`,
            }}
          />
        ) : null}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: `${headerDotSize}px`,
                height: `${headerDotSize}px`,
                borderRadius: "999px",
                backgroundColor: accent,
              }}
            />
            <span style={{ fontSize: "28px", opacity: 0.95 }}>{eyebrow}</span>
          </div>
          {badgeText ? (
            <div
              style={{
                fontSize: "22px",
                border: `${badgeBorderWidth}px solid ${accent}`,
                borderRadius: `${badgeBorderRadius}px`,
                padding: "8px 18px",
                opacity: 0.95,
              }}
            >
              {badgeText}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", zIndex: 1 }}>
          <div
            style={{
              fontSize: `${computedFontSize}px`,
              lineHeight: titleLineHeight,
              fontWeight: 700,
              letterSpacing: `${titleLetterSpacing}em`,
              display: "-webkit-box",
              WebkitLineClamp: titleClampLines,
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
            zIndex: 1,
            borderTop: `1px solid ${withHexOpacity(footerBorderColor, footerBorderOpacity)}`,
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
    { width: 1200, height: 630, fonts },
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
