import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  fetchSanityOgSettings,
  fetchSanitySeoSettings,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";

export const runtime = "nodejs";

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

const extractColor = (value: unknown, fallback: string) => {
  if (typeof value === "string") return normalizeHex(value, fallback);
  if (value && typeof value === "object" && "hex" in (value as Record<string, unknown>)) {
    return normalizeHex((value as { hex?: unknown }).hex, fallback);
  }
  return fallback;
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

const normalizeCaseMode = (value: unknown): "none" | "uppercase" | "lowercase" => {
  if (value === "uppercase" || value === "lowercase") return value;
  return "none";
};

const applyTextCase = (value: string, mode: "none" | "uppercase" | "lowercase") => {
  if (mode === "uppercase") return value.toUpperCase();
  if (mode === "lowercase") return value.toLowerCase();
  return value;
};

type OgIconDef = {
  viewBox: string;
  path: string;
};

const ICONS: Record<string, OgIconDef> = {
  rocket: { viewBox: "0 0 24 24", path: "M4.5 16.5c-1.2 1.2-1.6 2.9-1.7 4.7 1.8-.1 3.5-.5 4.7-1.7l2.1-2.1-3-3-2.1 2.1Zm6.1-3.3 4.1-4.1a8.8 8.8 0 0 0 2.4-6.3 8.8 8.8 0 0 0-6.3 2.4l-4.1 4.1m3.9 3.9 3 3m-5.9-9.8 5.9 5.9M14.5 9.5h.01" },
  sparkles: { viewBox: "0 0 24 24", path: "m12 3 1.3 3.2L16.5 7.5 13.3 8.8 12 12l-1.3-3.2L7.5 7.5l3.2-1.3L12 3Zm6 7 .8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9ZM5 14l1.1 2.7L8.8 18l-2.7 1.1L5 21.8l-1.1-2.7L1.2 18l2.7-1.3L5 14Z" },
  zap: { viewBox: "0 0 24 24", path: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z" },
  target: { viewBox: "0 0 24 24", path: "M12 3a9 9 0 1 0 9 9m-9-4a4 4 0 1 0 4 4m-4-1 .01 0M21 3l-6 6" },
  wrench: { viewBox: "0 0 24 24", path: "M14.7 6.3a4.5 4.5 0 0 0-5.9 5.9L3 18l3 3 5.8-5.8a4.5 4.5 0 0 0 5.9-5.9l-3 3-2.4-.6-.6-2.4 3-3Z" },
  trendingUp: { viewBox: "0 0 24 24", path: "m22 7-7.5 7.5-4-4L2 19m13-12h7v7" },
  lightbulb: { viewBox: "0 0 24 24", path: "M9 18h6m-5 3h4m-6.5-6.5A6.5 6.5 0 1 1 16.5 14.5c-.7.8-1.3 1.6-1.7 2.5h-5.6c-.4-.9-1-1.7-1.7-2.5Z" },
  trophy: { viewBox: "0 0 24 24", path: "M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Zm10 1h3a3 3 0 0 1-3 3m-10-3H4a3 3 0 0 0 3 3" },
  globe: { viewBox: "0 0 24 24", path: "M12 2a10 10 0 1 0 0 20m0-20c3 2.5 5 6.2 5 10s-2 7.5-5 10m0-20c-3 2.5-5 6.2-5 10s2 7.5 5 10M2 12h20" },
};
const RANDOM_ICON_KEYS = Object.keys(ICONS);

const hashText = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickIconFromName = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("rocket")) return "rocket";
  if (n.includes("sparkle") || n.includes("star")) return "sparkles";
  if (n.includes("zap") || n.includes("bolt")) return "zap";
  if (n.includes("target") || n.includes("bullseye")) return "target";
  if (n.includes("wrench") || n.includes("tool")) return "wrench";
  if (n.includes("chart") || n.includes("trending")) return "trendingUp";
  if (n.includes("light") || n.includes("bulb")) return "lightbulb";
  if (n.includes("award") || n.includes("trophy")) return "trophy";
  return "globe";
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") || "";
  const badge = searchParams.get("badge") || "";

  const [seoSettings, ogSettings, siteSettings] = await Promise.all([
    fetchSanitySeoSettings().catch(() => null),
    fetchSanityOgSettings().catch(() => null),
    fetchSanitySettings().catch(() => null),
  ]);

  const siteName =
    (siteSettings as { siteName?: string; brandName?: string } | null)?.siteName ||
    (siteSettings as { siteName?: string; brandName?: string } | null)?.brandName ||
    "KotaCom";
  const siteUrl = (seoSettings as { siteUrl?: string } | null)?.siteUrl || "";
  const domain = siteUrl ? new URL(siteUrl).hostname : "kotacom.id";

  const maxTitle = normalizeNumber((ogSettings as any)?.titleMaxLength, 140, 40, 220);
  const title = clampTitle(rawTitle || "KotaCom", maxTitle);
  const gradientFrom = extractColor((ogSettings as any)?.gradientFrom, DEFAULTS.gradientFrom);
  const gradientTo = extractColor((ogSettings as any)?.gradientTo, DEFAULTS.gradientTo);
  const accent = extractColor((ogSettings as any)?.accentColor, DEFAULTS.accent);
  const textColor = extractColor((ogSettings as any)?.textColor, DEFAULTS.text);
  const footerBorderColor = extractColor((ogSettings as any)?.footerBorderColor, "#FFFFFF");
  const iconCardBgColor = extractColor((ogSettings as any)?.iconCardBgColor, "#111827");
  const iconCardBorderColor = extractColor((ogSettings as any)?.iconCardBorderColor, accent);
  const footerBorderOpacity = normalizeNumber((ogSettings as any)?.footerBorderOpacity, 0.18, 0, 1);
  const eyebrow =
    (typeof (ogSettings as any)?.eyebrow === "string" && (ogSettings as any).eyebrow.trim()) ||
    DEFAULTS.eyebrow;
  const fontFamily =
    (typeof (ogSettings as any)?.fontFamily === "string" &&
      (ogSettings as any).fontFamily.trim()) ||
    DEFAULTS.fontFamily;
  const fontUrl = normalizeFontUrl((ogSettings as any)?.fontUrl);

  const canvasPaddingX = normalizeNumber((ogSettings as any)?.canvasPaddingX, 76, 24, 180);
  const canvasPaddingY = normalizeNumber((ogSettings as any)?.canvasPaddingY, 68, 24, 180);
  const headerDotSize = normalizeNumber((ogSettings as any)?.headerDotSize, 10, 4, 24);
  const badgeBorderWidth = normalizeNumber((ogSettings as any)?.badgeBorderWidth, 1, 0, 8);
  const badgeBorderRadius = normalizeNumber((ogSettings as any)?.badgeBorderRadius, 999, 0, 999);
  const titleFontSize = normalizeNumber((ogSettings as any)?.titleFontSize, 82, 32, 120);
  const titleLineHeight = normalizeNumber((ogSettings as any)?.titleLineHeight, 1.08, 0.9, 1.6);
  const titleLetterSpacing = normalizeNumber(
    (ogSettings as any)?.titleLetterSpacingEm,
    -0.03,
    -0.2,
    0.2,
  );
  const titleClampLines = normalizeNumber((ogSettings as any)?.titleClampLines, 3, 1, 5);
  const overlayEnabled = Boolean((ogSettings as any)?.overlayEnabled ?? true);
  const overlayOpacity = normalizeNumber((ogSettings as any)?.overlayOpacity, 0.12, 0, 1);
  const showTitleIcon = Boolean((ogSettings as any)?.showTitleIcon ?? true);
  const randomizeTitleIcon = Boolean((ogSettings as any)?.randomizeTitleIcon ?? true);
  const showEyebrow = Boolean((ogSettings as any)?.showEyebrow ?? true);
  const showHeaderRight = Boolean((ogSettings as any)?.showHeaderRight ?? true);
  const showFooterLeft = Boolean((ogSettings as any)?.showFooterLeft ?? true);
  const showFooterRight = Boolean((ogSettings as any)?.showFooterRight ?? true);
  const titleAlign = (ogSettings as any)?.titleAlign === "center" ? "center" : "left";
  const iconSize = normalizeNumber((ogSettings as any)?.iconSize, 48, 20, 120);
  const iconCardSize = normalizeNumber((ogSettings as any)?.iconCardSize, 92, 48, 180);
  const iconCardRadius = normalizeNumber((ogSettings as any)?.iconCardRadius, 24, 0, 999);
  const iconCardBorderWidth = normalizeNumber((ogSettings as any)?.iconCardBorderWidth, 1, 0, 8);
  const configuredIconName =
    (typeof (ogSettings as any)?.titleIcon?.name === "string" &&
      (ogSettings as any).titleIcon.name.trim()) ||
    "";
  const configuredIconSvg =
    (typeof (ogSettings as any)?.titleIcon?.svg === "string" &&
      (ogSettings as any).titleIcon.svg.trim()) ||
    "";
  const randomIconKey =
    RANDOM_ICON_KEYS[hashText(`${title}|${badge}`) % RANDOM_ICON_KEYS.length] || "globe";
  const useCustomSvg = !randomizeTitleIcon && configuredIconSvg;
  const selectedIconKey = randomizeTitleIcon
    ? randomIconKey
    : configuredIconName
      ? pickIconFromName(configuredIconName)
      : randomIconKey;
  const selectedIcon = ICONS[selectedIconKey] || ICONS.globe;

  const computedFontSize =
    title.length > 100 ? Math.max(32, titleFontSize - 24) : title.length > 60 ? Math.max(32, titleFontSize - 16) : titleFontSize;
  const badgeText =
    badge || (typeof (ogSettings as any)?.defaultBadge === "string" ? (ogSettings as any).defaultBadge : "");
  const headerRightText =
    (typeof (ogSettings as any)?.headerRightText === "string" &&
      (ogSettings as any).headerRightText.trim()) ||
    badgeText;
  const footerLeftText =
    (typeof (ogSettings as any)?.footerLeftText === "string" &&
      (ogSettings as any).footerLeftText.trim()) ||
    siteName;
  const footerRightText =
    (typeof (ogSettings as any)?.footerRightText === "string" &&
      (ogSettings as any).footerRightText.trim()) ||
    domain;
  const titleCaseMode = normalizeCaseMode((ogSettings as any)?.titleCaseMode);
  const cornerCaseMode = normalizeCaseMode((ogSettings as any)?.cornerCaseMode);
  const stylePreset = (ogSettings as any)?.stylePreset === "classic" ? "classic" : "morphglass";
  const subtitleText =
    (typeof (ogSettings as any)?.subtitleText === "string" &&
      (ogSettings as any).subtitleText.trim()) ||
    "";
  const displayTitle = applyTextCase(title, titleCaseMode);
  const displayEyebrow = showEyebrow ? applyTextCase(eyebrow, cornerCaseMode) : "";
  const displayHeaderRight = showHeaderRight ? applyTextCase(headerRightText, cornerCaseMode) : "";
  const displayFooterLeft = showFooterLeft ? applyTextCase(footerLeftText, cornerCaseMode) : "";
  const displayFooterRight = showFooterRight ? applyTextCase(footerRightText, cornerCaseMode) : "";

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style?: "normal" | "italic";
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  }> = [];
  if (fontUrl) {
    try {
      const data = await fetch(fontUrl, {
        next: { revalidate: 86400 },
      }).then((res) => {
        if (!res.ok) throw new Error(`font fetch failed: ${res.status}`);
        return res.arrayBuffer();
      });
      fonts.push({
        name: fontFamily || "Geist",
        data,
        style: "normal",
        weight: 600,
      });
    } catch {
      // fallback to local font below
    }
  }

  if (fonts.length === 0) {
    try {
      const localFontPath = path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf");
      const localFontBuffer = await readFile(localFontPath);
      fonts.push({
        name: "Geist",
        data: localFontBuffer.buffer.slice(
          localFontBuffer.byteOffset,
          localFontBuffer.byteOffset + localFontBuffer.byteLength,
        ),
        style: "normal",
        weight: 600,
      });
    } catch {
      // handled by explicit guard below
    }
  }

  if (fonts.length === 0) {
    return new Response(
      JSON.stringify({
        ok: false,
        message:
          "OG font loading failed. Provide ogSettings.fontUrl or ensure public/fonts/Geist-Regular.ttf exists.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: stylePreset === "morphglass" ? "14px 18px" : "0",
            borderRadius: stylePreset === "morphglass" ? "18px" : "0",
            border:
              stylePreset === "morphglass"
                ? `1px solid ${withHexOpacity("#FFFFFF", 0.18)}`
                : "none",
            backgroundColor:
              stylePreset === "morphglass" ? withHexOpacity("#FFFFFF", 0.06) : "transparent",
            backdropFilter: stylePreset === "morphglass" ? "blur(6px)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: `${headerDotSize}px`,
                height: `${headerDotSize}px`,
                borderRadius: "999px",
                backgroundColor: accent,
              }}
            />
            <span style={{ fontSize: "28px", opacity: 0.95 }}>{displayEyebrow}</span>
          </div>
          {displayHeaderRight ? (
            <div
              style={{
                fontSize: "22px",
                border: `${badgeBorderWidth}px solid ${stylePreset === "morphglass" ? withHexOpacity(accent, 0.8) : accent}`,
                borderRadius: `${badgeBorderRadius}px`,
                padding: "8px 18px",
                opacity: 0.95,
                backgroundColor: stylePreset === "morphglass" ? withHexOpacity("#FFFFFF", 0.08) : "transparent",
              }}
            >
              {displayHeaderRight}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: titleAlign === "center" ? "center" : "flex-start",
          }}
        >
          {showTitleIcon ? (
            <div
              style={{
                width: `${iconCardSize}px`,
                height: `${iconCardSize}px`,
                borderRadius: `${iconCardRadius}px`,
                border: `${iconCardBorderWidth}px solid ${iconCardBorderColor}`,
                backgroundColor: iconCardBgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  stylePreset === "morphglass"
                    ? "0 18px 40px rgba(3, 7, 18, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22)"
                    : "none",
              }}
            >
              {useCustomSvg ? (
                <img
                  src={`data:image/svg+xml,${encodeURIComponent(
                    configuredIconSvg
                      .replace(/width="[^"]*"/, `width="${iconSize}"`)
                      .replace(/height="[^"]*"/, `height="${iconSize}"`)
                      .replace(/style="[^"]*"/, "")
                      .replace(/currentColor/g, textColor)
                  )}`}
                  width={iconSize}
                  height={iconSize}
                />
              ) : (
                <svg
                  width={iconSize}
                  height={iconSize}
                  viewBox={selectedIcon.viewBox}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "block" }}
                >
                  <path
                    d={selectedIcon.path}
                    stroke={textColor}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ) : null}
          <div style={{ width: "100%", display: "flex", justifyContent: titleAlign === "center" ? "center" : "flex-start" }}>
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
                textAlign: titleAlign,
                width: "100%",
                maxWidth: titleAlign === "center" ? "88%" : "100%",
              }}
            >
              {displayTitle}
            </div>
          </div>
          {subtitleText ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: titleAlign === "center" ? "center" : "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: titleAlign,
                  justifyContent: titleAlign === "center" ? "center" : "flex-start",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: withHexOpacity(textColor, 0.96),
                  maxWidth: titleAlign === "center" ? "88%" : "100%",
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "block", flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" fill="#25D366" />
                  <path
                    d="M8.4 7.8c-.3.2-.8.8-.9 1.4-.2 1.2.3 2.8 1.4 4.1 1 1.2 2.4 2.3 3.9 2.6.7.1 1.3 0 1.7-.2.3-.2.8-.7 1-1.1.1-.2.1-.4 0-.6l-.8-1.1c-.2-.2-.5-.3-.7-.1l-1 .6c-.2.1-.4.1-.6 0-.7-.4-1.5-1-2.1-1.8-.5-.7-.8-1.3-1-2.1-.1-.2 0-.4.1-.6l.7-.9c.2-.2.2-.5.1-.7l-.8-1.2c-.2-.3-.5-.4-.7-.3Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <span>{applyTextCase(subtitleText, titleCaseMode)}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${withHexOpacity(footerBorderColor, footerBorderOpacity)}`,
            paddingTop: "28px",
            paddingLeft: stylePreset === "morphglass" ? "18px" : "0",
            paddingRight: stylePreset === "morphglass" ? "18px" : "0",
            paddingBottom: stylePreset === "morphglass" ? "14px" : "0",
            borderRadius: stylePreset === "morphglass" ? "16px" : "0",
            backgroundColor:
              stylePreset === "morphglass" ? withHexOpacity("#FFFFFF", 0.04) : "transparent",
            fontSize: "24px",
            opacity: 0.92,
          }}
        >
          <span>{displayFooterLeft}</span>
          <span>{displayFooterRight}</span>
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
