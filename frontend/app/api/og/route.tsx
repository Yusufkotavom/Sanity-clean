import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  fetchSanityOgSettings,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";

export const runtime = "nodejs";

const FALLBACK_OG_IMAGE_URL =
  "https://www.kotacom.id/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fb017f7tl%2Fproduction%2Fadbb1e64ffa7b2b719d8c705aff151901082526e-1024x1024.jpg%3Fw%3D960%26fm%3Dwebp%26q%3D75%26fit%3Dcrop&w=828&q=75";

const FALLBACK_LOGO_URL =
  "https://cdn.sanity.io/images/b017f7tl/production/53f4340b4153bacc7e593584daad4d6a94f78a3f-1857x427.png?rect=0,0,430,427&fm=png&q=90&fit=crop";

const GEIST_FONT_BASE_URL =
  "https://cdn.jsdelivr.net/npm/geist@1.7.0/dist/fonts/geist-sans";

function truncateText(input: string, max: number): string {
  return input.length > max ? `${input.substring(0, max)}…` : input;
}

function isSafeUrl(value: string | null): value is string {
  if (!value) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

async function loadFont(weight: "Regular" | "SemiBold" | "Bold"): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${GEIST_FONT_BASE_URL}/Geist-${weight}.ttf`, { next: { revalidate: 86400 } });
    return res.ok ? res.arrayBuffer() : null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawTitle = searchParams.get("title") || "Kotacom.id";
  const title = truncateText(rawTitle, 72);
  const description = truncateText(searchParams.get("description") || "", 96);
  const explicitImage = searchParams.get("image");

  const [ogSettings, siteSettings, fontRegular, fontSemiBold, fontBold] = await Promise.all([
    fetchSanityOgSettings().catch(() => null),
    fetchSanitySettings().catch(() => null),
    loadFont("Regular"),
    loadFont("SemiBold"),
    loadFont("Bold"),
  ]);

  const og = ogSettings as any;
  const site = siteSettings as any;

  const logoUrl = og?.logoUrl || site?.logo?.asset?.url || FALLBACK_LOGO_URL;
  const brandName = og?.brandName || site?.siteName || "kotacom";
  const ctaText = og?.ctaText || "WA 085799520350 · kotacom.id";
  const showDescription = og?.showDescription !== false;
  const showCta = og?.showCta !== false;

  // Image selection: explicit param > category match > random from library > fallback
  const badge = searchParams.get("badge") || "";
  const imagesLib = Array.isArray(og?.images) ? og.images : [];
  
  // Auto-detect category from title if no badge param
  const detectCategory = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("website") || t.includes("web dev") || t.includes("landing page")) return "website";
    if (t.includes("cetak") || t.includes("percetakan") || t.includes("printing")) return "percetakan";
    if (t.includes("software") || t.includes("aplikasi") || t.includes("pos")) return "software";
    if (t.includes("blog") || t.includes("artikel") || t.includes("tips")) return "blog";
    return "";
  };
  
  const category = badge || detectCategory(title);
  let bgImage = FALLBACK_OG_IMAGE_URL;
  
  if (isSafeUrl(explicitImage)) {
    bgImage = explicitImage;
  } else if (category && imagesLib.length > 0) {
    // Find all images matching category
    const matches = imagesLib.filter((img: any) => img.category?.toLowerCase() === category.toLowerCase());
    if (matches.length > 0) {
      // Pick from matches based on title hash (deterministic but varied)
      const hash = title.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
      bgImage = matches[hash % matches.length]?.asset?.url || og?.fallbackImage || FALLBACK_OG_IMAGE_URL;
    } else {
      bgImage = og?.fallbackImage || FALLBACK_OG_IMAGE_URL;
    }
  } else if (imagesLib.length > 0) {
    const hash = title.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    bgImage = imagesLib[hash % imagesLib.length]?.asset?.url || og?.fallbackImage || FALLBACK_OG_IMAGE_URL;
  } else if (og?.fallbackImage) {
    bgImage = og.fallbackImage;
  }

  const titleSize = title.length > 64 ? 42 : title.length > 54 ? 46 : title.length > 44 ? 50 : 56;

  const fonts = [
    fontRegular && { name: "Geist", data: fontRegular, style: "normal" as const, weight: 400 as const },
    fontSemiBold && { name: "Geist", data: fontSemiBold, style: "normal" as const, weight: 600 as const },
    fontBold && { name: "Geist", data: fontBold, style: "normal" as const, weight: 700 as const },
  ].filter(Boolean) as Array<{ name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 600 | 700 }>;

  if (!fonts.length) {
    return new Response("Font loading failed", { status: 500 });
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eef3f7",
          position: "relative",
        }}
      >
        {/* Background accents */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 10% 10%, rgba(99,102,241,0.16), transparent 45%), radial-gradient(circle at 88% 70%, rgba(14,165,233,0.18), transparent 40%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.9,
          }}
        />

        {/* Split card */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            width: "1080px",
            height: "540px",
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
            border: "1px solid rgba(148,163,184,0.28)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(248,250,255,0.98) 58%, rgba(239,246,255,0.98) 100%)",
          }}
        >
          {/* Left: Text */}
          <div
            style={{
              width: "56%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "50px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                backgroundImage:
                  "linear-gradient(rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.07) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {/* Logo + brand */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <img
                  src={logoUrl}
                  alt=""
                  width="52"
                  height="52"
                  style={{ width: "52px", height: "52px", objectFit: "contain", borderRadius: "10px" }}
                />
                <div
                  style={{
                    display: "flex",
                    fontSize: 36,
                    color: "#0f172a",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    fontFamily: "Geist",
                  }}
                >
                  {brandName}
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  display: "flex",
                  fontSize: titleSize,
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  fontFamily: "Geist",
                  maxHeight: "250px",
                  overflow: "hidden",
                }}
              >
                {title}
              </div>

              {/* Description */}
              {showDescription && description ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 20,
                    color: "#475569",
                    lineHeight: 1.45,
                    maxWidth: "92%",
                    fontFamily: "Geist",
                    maxHeight: "92px",
                    overflow: "hidden",
                  }}
                >
                  {description}
                </div>
              ) : null}
            </div>

            {/* CTA bar */}
            {showCta ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  color: "#ffffff",
                  backgroundColor: "#000000",
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontFamily: "Geist",
                  alignSelf: "flex-start",
                  letterSpacing: "-0.01em",
                  position: "relative",
                  marginTop: "12px",
                }}
              >
                {ctaText}
              </div>
            ) : null}
          </div>

          {/* Right: Image */}
          <div
            style={{
              width: "44%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px",
              background:
                "linear-gradient(130deg, rgba(15,23,42,0.96), rgba(30,41,59,0.9) 50%, rgba(37,99,235,0.72))",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "420px",
                height: "420px",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 14px 36px rgba(2,6,23,0.46)",
                position: "relative",
              }}
            >
              <img
                src={bgImage}
                alt=""
                width={520}
                height={520}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.32) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );

  image.headers.set("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");
  return image;
}
