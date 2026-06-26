import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Ga4Tracker from "@/components/analytics/ga4-tracker";
import { generateRootMetadata } from "@/sanity/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import { fetchSanitySettings, fetchSanityThemeSettings, fetchSanitySeoSettings } from "@/sanity/lib/fetch";
import { ButtonThemeProvider } from "@/components/ui/button-theme-context";

const THEME_PRESETS: Record<
  string,
  {
    lightPrimary: string;
    lightPrimaryForeground: string;
    lightAccent: string;
    lightRing: string;
    darkPrimary: string;
    darkPrimaryForeground: string;
    darkAccent: string;
    darkRing: string;
  }
> = {
  neutral: {
    lightPrimary: "#171717",
    lightPrimaryForeground: "#FAFAFA",
    lightAccent: "#F5F5F5",
    lightRing: "#0070F3",
    darkPrimary: "#FAFAFA",
    darkPrimaryForeground: "#111111",
    darkAccent: "#222222",
    darkRing: "#3291FF",
  },
  ocean: {
    lightPrimary: "#0070F3",
    lightPrimaryForeground: "#FAFAFA",
    lightAccent: "#EBF4FF",
    lightRing: "#0070F3",
    darkPrimary: "#3291FF",
    darkPrimaryForeground: "#0A0A0A",
    darkAccent: "#1A2233",
    darkRing: "#60A5FA",
  },
  sunset: {
    lightPrimary: "#E5484D",
    lightPrimaryForeground: "#FAFAFA",
    lightAccent: "#FFF3E0",
    lightRing: "#F59E0B",
    darkPrimary: "#FB7185",
    darkPrimaryForeground: "#111111",
    darkAccent: "#2B1A16",
    darkRing: "#FBBF24",
  },
  "brand-tricolor-a": {
    lightPrimary: "#0070F3",
    lightPrimaryForeground: "#FAFAFA",
    lightAccent: "#FFE08A",
    lightRing: "#F59E0B",
    darkPrimary: "#3291FF",
    darkPrimaryForeground: "#0A0A0A",
    darkAccent: "#3A1A1D",
    darkRing: "#FBBF24",
  },
  "brand-tricolor-b": {
    lightPrimary: "#E5484D",
    lightPrimaryForeground: "#FAFAFA",
    lightAccent: "#EAF2FF",
    lightRing: "#F59E0B",
    darkPrimary: "#FB7185",
    darkPrimaryForeground: "#111111",
    darkAccent: "#112033",
    darkRing: "#FBBF24",
  },
  "brand-tricolor-c": {
    lightPrimary: "#F59E0B",
    lightPrimaryForeground: "#171717",
    lightAccent: "#EAF2FF",
    lightRing: "#E5484D",
    darkPrimary: "#FBBF24",
    darkPrimaryForeground: "#111111",
    darkAccent: "#132033",
    darkRing: "#FB7185",
  },
};

import { stegaClean } from "@/lib/clean";

function toHexColor(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = stegaClean(value.trim());
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(normalized)
    ? normalized
    : undefined;
}

type SettingsData = {
  siteName?: string | null;
  brandName?: string | null;
  logo?: {
    dark?: unknown;
    light?: unknown;
  } | null;
  socialLinks?: Array<{ url?: string | null }> | null;
};

type SeoData = {
  siteUrl?: string | null;
  siteSearchPath?: string | null;
  defaultDescription?: string | null;
  defaultAggregateRating?: {
    ratingValue?: number | null;
    reviewCount?: number | null;
    bestRating?: number | null;
  } | null;
  companyInfo?: {
    name?: string | null;
    foundedYear?: number | null;
    address?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    operatingHours?: string | null;
    serviceAreas?: string[] | null;
  } | null;
};

function getSiteUrl(seo: SeoData | null) {
  return seo?.siteUrl?.trim()?.replace(/\/+$/, "") || "";
}

function imageUrlFromSanity(source: unknown): string | undefined {
  try {
    return source ? urlFor(source as any).quality(85).url() : undefined;
  } catch {
    return undefined;
  }
}

function buildJsonLdScripts(settings: SettingsData | null, seo: SeoData | null) {
  const siteUrl = getSiteUrl(seo);
  if (!siteUrl) return [] as string[];

  const companyName = seo?.companyInfo?.name || settings?.brandName || settings?.siteName || "Schema UI";
  const description = seo?.defaultDescription || undefined;
  const logoSource = settings?.logo?.dark || settings?.logo?.light;
  const logoUrl = imageUrlFromSanity(logoSource);
  const socials = (settings?.socialLinks || [])
    .map((entry) => entry?.url?.trim())
    .filter((value): value is string => Boolean(value));
  const searchPath = seo?.siteSearchPath?.trim();
  const searchUrl = searchPath && searchPath.startsWith("/") ? `${siteUrl}${searchPath}` : null;
  const phone = seo?.companyInfo?.phone || seo?.companyInfo?.whatsapp || undefined;

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: siteUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(description ? { description } : {}),
    ...(seo?.companyInfo?.foundedYear ? { foundingDate: String(seo.companyInfo.foundedYear) } : {}),
    ...(socials.length ? { sameAs: socials } : {}),
    ...(phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: phone,
            contactType: "customer service",
          },
        }
      : {}),
  };

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyName,
    url: siteUrl,
    ...(description ? { description } : {}),
    ...(searchUrl
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${searchUrl}?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };

  const localBusiness: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: companyName,
    url: siteUrl,
    ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
    ...(description ? { description } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(seo?.companyInfo?.email ? { email: seo.companyInfo.email } : {}),
    ...(seo?.companyInfo?.address ? { address: seo.companyInfo.address } : {}),
    ...((seo?.companyInfo?.serviceAreas || []).length
      ? {
          areaServed: (seo?.companyInfo?.serviceAreas || []).map((name) => ({
            "@type": "Place",
            name,
          })),
        }
      : {}),
    ...(socials.length ? { sameAs: socials } : {}),
    ...(seo?.defaultAggregateRating?.ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(seo.defaultAggregateRating.ratingValue),
            reviewCount: String(seo.defaultAggregateRating.reviewCount || 1),
            bestRating: String(seo.defaultAggregateRating.bestRating || 5),
          },
        }
      : {}),
  };

  return [organization, website, localBusiness].map((entry) => JSON.stringify(entry));
}

export async function generateMetadata(): Promise<Metadata> {
  return generateRootMetadata();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, themeSettings, seoSettings] = await Promise.all([
    fetchSanitySettings(),
    fetchSanityThemeSettings(),
    fetchSanitySeoSettings(),
  ]);
  const colors = themeSettings?.themeColors;
  const themeVars: Record<string, string> = {};
  const preset = THEME_PRESETS[stegaClean(colors?.themePreset) || "neutral"];

  if (preset) {
    themeVars["--studio-light-primary"] = preset.lightPrimary;
    themeVars["--studio-light-primary-foreground"] = preset.lightPrimaryForeground;
    themeVars["--studio-light-accent"] = preset.lightAccent;
    themeVars["--studio-light-ring"] = preset.lightRing;
    themeVars["--studio-dark-primary"] = preset.darkPrimary;
    themeVars["--studio-dark-primary-foreground"] = preset.darkPrimaryForeground;
    themeVars["--studio-dark-accent"] = preset.darkAccent;
    themeVars["--studio-dark-ring"] = preset.darkRing;
  }

  const lightPrimary = toHexColor(colors?.lightPrimary);
  if (lightPrimary) themeVars["--studio-light-primary"] = lightPrimary;

  const lightPrimaryForeground = toHexColor(colors?.lightPrimaryForeground);
  if (lightPrimaryForeground) {
    themeVars["--studio-light-primary-foreground"] = lightPrimaryForeground;
  }

  const lightAccent = toHexColor(colors?.lightAccent);
  if (lightAccent) themeVars["--studio-light-accent"] = lightAccent;

  const lightRing = toHexColor(colors?.lightRing);
  if (lightRing) themeVars["--studio-light-ring"] = lightRing;

  const darkPrimary = toHexColor(colors?.darkPrimary);
  if (darkPrimary) themeVars["--studio-dark-primary"] = darkPrimary;

  const darkPrimaryForeground = toHexColor(colors?.darkPrimaryForeground);
  if (darkPrimaryForeground) {
    themeVars["--studio-dark-primary-foreground"] = darkPrimaryForeground;
  }

  const darkAccent = toHexColor(colors?.darkAccent);
  if (darkAccent) themeVars["--studio-dark-accent"] = darkAccent;

  const darkRing = toHexColor(colors?.darkRing);
  if (darkRing) themeVars["--studio-dark-ring"] = darkRing;

  const tokens = themeSettings?.themeTokens;
  const clean = (v?: string | null) => stegaClean(v) || undefined;
  const themeTokenClasses: string[] = [];
  const radiusScale = clean(tokens?.radiusScale) || "lg";
  const cardVariant = clean(tokens?.defaultCardVariant) || "glass";
  const accentTone = clean(tokens?.accentTone) || "neutral";
  const shadowDepth = clean(tokens?.shadowDepth) || "md";
  const cardPadding = clean(tokens?.cardPadding) || "normal";
  const defaultDensity = clean(tokens?.defaultDensity) || "normal";
  themeTokenClasses.push(
    `card-radius-${radiusScale}`,
    `card-variant-${cardVariant}`,
    `card-surface-${accentTone}`,
    `card-shadow-${shadowDepth}`,
    `card-pad-${cardPadding}`,
    `section-density-${defaultDensity}`,
  );

  const buttons = themeSettings?.themeButtons;
  const btnRadius = clean(buttons?.radius) || "md";
  const btnShadow = clean(buttons?.shadow) || "md";
  const btnBorder = clean(buttons?.border) || "subtle";
  themeTokenClasses.push(
    `btn-radius-${btnRadius}`,
    `btn-shadow-${btnShadow}`,
    `btn-border-${btnBorder}`,
  );

  const jsonLdScripts = buildJsonLdScripts(settings as SettingsData | null, seoSettings as SeoData | null);

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${themeTokenClasses.join(" ")}`}
      style={themeVars}
    >
      <link rel="icon" href="/fav.png" />
      <body
        className={cn("min-h-screen bg-background font-sans antialiased overscroll-none")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ButtonThemeProvider value={buttons ?? null} scope="global">
            {children}
          </ButtonThemeProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
        <Ga4Tracker />
        {jsonLdScripts.map((jsonLd, index) => (
          <script
            key={`json-ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        ))}
      </body>
    </html>
  );
}
