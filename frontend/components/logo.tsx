"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SETTINGS_QUERY_RESULT } from "@/sanity.types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KOTACOM_DEFAULT_LOGO = "/images/branding/kotacom-logo.svg";
const KOTACOM_DEFAULT_LOGO_WIDTH = 1280;
const KOTACOM_DEFAULT_LOGO_HEIGHT = 1248;

const BRAND_NAME_SIZE_MAP: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export default function Logo({
  settings,
  className,
  imageClassName,
  priority = false,
}: {
  settings: SETTINGS_QUERY_RESULT;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before hydration, use light theme as default
  const themeToUse = mounted ? resolvedTheme : "light";

  // Select the appropriate logo based on resolved theme (handles "system" correctly)
  const selectedLogo =
    settings?.logo?.[themeToUse === "dark" ? "dark" : "light"];

  // If no logo for the current theme, try the opposite theme as fallback
  const fallbackLogo =
    settings?.logo?.[themeToUse === "dark" ? "light" : "dark"];
  const logoToUse = selectedLogo || fallbackLogo;

  const showBrandName = (settings?.logo as { showBrandName?: boolean } | null)?.showBrandName;
  const brandNameSize = (settings?.logo as { brandNameSize?: string } | null)?.brandNameSize || "md";
  const brandNameClass = BRAND_NAME_SIZE_MAP[brandNameSize] || "text-base";
  const brandName = settings?.siteName || settings?.brandName || "Schema UI";
  const logoLabel = settings?.siteName || settings?.brandName || "Site logo";

  if (logoToUse) {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        <Image
          src={urlFor(logoToUse).url()}
          alt={logoLabel}
          width={
            (settings.logo?.width as number) ??
            logoToUse?.asset?.metadata?.dimensions?.width ??
            KOTACOM_DEFAULT_LOGO_WIDTH
          }
          height={
            (settings.logo?.height as number) ??
            logoToUse?.asset?.metadata?.dimensions?.height ??
            KOTACOM_DEFAULT_LOGO_HEIGHT
          }
          title={logoLabel}
          className={cn("h-10 w-auto", imageClassName)}
          placeholder={
            logoToUse?.asset?.metadata?.lqip &&
            logoToUse?.asset?.mimeType !== "image/svg+xml"
              ? "blur"
              : undefined
          }
          blurDataURL={logoToUse?.asset?.metadata?.lqip || undefined}
          quality={85}
          priority={priority}
        />
        {showBrandName && (
          <span
            className={cn(
              "font-semibold tracking-tight text-foreground transition-colors",
              brandNameClass
            )}
          >
            {brandName}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={KOTACOM_DEFAULT_LOGO}
        alt={logoLabel}
        title={logoLabel}
        width={KOTACOM_DEFAULT_LOGO_WIDTH}
        height={KOTACOM_DEFAULT_LOGO_HEIGHT}
        className={cn("h-10 w-auto dark:invert", imageClassName)}
        priority={priority}
      />
      {showBrandName && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground transition-colors",
            brandNameClass
          )}
        >
          {brandName}
        </span>
      )}
    </span>
  );
}
