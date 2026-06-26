"use client";

import Link from "next/link";
import Image from "next/image";
import SectionContainer from "@/components/ui/section-container";
import { buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";

interface BannerSectionProps {
  padding?: any;
  colorVariant?: any;
  title?: string | null;
  subtitle?: string | null;
  bgType?: "color" | "image" | null;
  bgImage?: any;
  size?: "default" | "slim" | null;
  align?: "left-right" | "center" | null;
  link?: {
    href?: string;
    title?: string;
    target?: boolean;
    buttonVariant?: string;
  } | null;
}

export default function BannerSection({
  padding,
  colorVariant,
  title,
  subtitle,
  bgType = "color",
  bgImage,
  size = "default",
  align = "left-right",
  link,
}: BannerSectionProps) {
  const cleanBgType = stegaClean(bgType);
  const cleanSize = stegaClean(size) || "default";
  const cleanAlign = stegaClean(align) || "left-right";

  const isSlim = cleanSize === "slim";
  const isCentered = cleanAlign === "center" || isSlim;

  const showBgImage = cleanBgType === "image" && bgImage?.asset;
  const isSvgBg =
    bgImage?.asset?.mimeType === "image/svg+xml" ||
    bgImage?.asset?.url?.endsWith(".svg");

  const resolvedBgUrl = showBgImage ? urlFor(bgImage).url() : "";

  // Override standard padding if size is slim
  const paddingOverride = isSlim
    ? { top: false, bottom: false, _type: "section-padding" as const }
    : padding;

  return (
    <div className="relative overflow-hidden w-full">
      {/* Background Image Container */}
      {showBgImage && (
        <div className="absolute inset-0 z-0">
          {isSvgBg ? (
            <img
              className="object-cover w-full h-full"
              src={resolvedBgUrl}
              alt="Banner background"
            />
          ) : (
            <Image
              className="object-cover"
              src={resolvedBgUrl}
              alt="Banner background"
              fill
              placeholder={bgImage?.asset?.metadata?.lqip ? "blur" : undefined}
              blurDataURL={bgImage?.asset?.metadata?.lqip || ""}
              sizes="100vw"
              quality={85}
              priority={isSlim}
            />
          )}
          {/* Subtle overlay for readability */}
          <div className="absolute inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-[0.5px]" />
        </div>
      )}

      <SectionContainer
        color={showBgImage ? "transparent" : colorVariant || "primary"}
        padding={paddingOverride}
        className={cn(
          "relative z-10 transition-all duration-300",
          isSlim ? "py-2 md:py-2.5" : undefined,
          showBgImage ? "text-white dark:text-zinc-100" : undefined
        )}
      >
        <div
          className={cn(
            "flex w-full gap-4",
            isSlim
              ? "flex-row items-center justify-center text-center flex-wrap"
              : isCentered
              ? "flex-col items-center text-center"
              : "flex-col md:flex-row md:items-center md:justify-between"
          )}
        >
          {/* Text Area */}
          <div className={cn("max-w-4xl", isSlim ? "w-auto flex items-center gap-2 flex-wrap justify-center" : "w-full")}>
            {title && (
              <h2
                className={cn(
                  "font-bold tracking-tight",
                  isSlim
                    ? "text-sm md:text-sm font-semibold inline-block"
                    : "text-2xl md:text-3xl"
                )}
              >
                {title}
              </h2>
            )}

            {subtitle && !isSlim && (
              <p
                className={cn(
                  "mt-2 text-base md:text-lg opacity-90 leading-relaxed max-w-2xl",
                  isCentered ? "mx-auto" : ""
                )}
              >
                {subtitle}
              </p>
            )}

            {subtitle && isSlim && (
              <span className="text-xs md:text-xs opacity-80 hidden sm:inline-block">
                • {subtitle}
              </span>
            )}
          </div>

          {/* Action / CTA Button */}
          {link?.href && link?.title && (
            <div className={cn("shrink-0", isSlim ? "inline-block" : "mt-2 md:mt-0")}>
              <Link
                href={link.href}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener noreferrer" : undefined}
                className={cn(
                  buttonVariants({
                    variant: (link.buttonVariant || (isSlim ? "secondary" : "default")) as any,
                    size: isSlim ? "sm" : "default",
                  }),
                  "rounded-full transition-all duration-300 font-semibold",
                  isSlim
                    ? "h-6 px-3 text-xs bg-white text-black hover:bg-white/95 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border-none"
                    : "shadow-md hover:shadow-lg scale-98 hover:scale-100"
                )}
              >
                {link.title}
              </Link>
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
