import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type Density = "compact" | "regular";
type HeightVariant = "compact" | "regular" | "tall" | "auto";

const densityStyles: Record<Density, string> = {
  compact:
    "rounded-3xl border p-3.5 lg:p-4",
  regular:
    "rounded-3xl border p-4",
};

const mediaHeightStyles: Record<HeightVariant, string> = {
  compact: "aspect-[16/9]",
  regular: "h-44 sm:h-48 lg:h-56",
  tall: "h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem]",
  auto: "h-auto w-full",
};

export function ArchiveCardShell({
  href,
  children,
  className,
  density = "regular",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  density?: Density;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full flex-col justify-between overflow-hidden transition hover:border-primary",
        densityStyles[density],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ArchiveCardMedia({
  image,
  altFallback = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  heightVariant = "regular",
  className,
  quality = 75,
  priority,
}: {
  image?: any;
  altFallback?: string;
  sizes?: string;
  heightVariant?: HeightVariant;
  className?: string;
  quality?: number;
  priority?: boolean;
}) {
  if (!image?.asset?._id) {
    return null;
  }

  const isCompact = heightVariant === "compact";
  const isAuto = heightVariant === "auto";
  const targetWidth = isCompact ? 720 : heightVariant === "tall" ? 960 : 800;
  const targetHeight = Math.round((targetWidth * 9) / 16);

  return (
    <div
      className={cn(
        "relative mb-4 overflow-hidden rounded-2xl",
        mediaHeightStyles[heightVariant],
        className,
      )}
    >
      <Image
        src={urlFor(image).width(targetWidth).quality(quality).url()}
        alt={image?.alt || altFallback}
        fill={!isCompact && !isAuto}
        width={isCompact || isAuto ? targetWidth : undefined}
        height={isCompact || isAuto ? targetHeight : undefined}
        style={{ objectFit: isCompact || isAuto ? "contain" : "cover", height: isAuto ? "auto" : "100%", width: "100%" }}
        placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image?.asset?.metadata?.lqip || ""}
        sizes={sizes}
        quality={quality}
        priority={priority}
      />
    </div>
  );
}

export function ArchiveCardTitle({
  children,
  className,
  density = "regular",
  as: Component = "h3",
}: {
  children: ReactNode;
  className?: string;
  density?: Density;
  as?: "h2" | "h3";
}) {
  return (
    <Component
      className={cn(
        density === "compact"
          ? "text-lg font-semibold leading-snug text-foreground lg:text-xl"
          : "text-display-lg",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function ArchiveCardMeta({
  items,
  className,
  density = "regular",
}: {
  items: Array<string | number | undefined | null | false>;
  className?: string;
  density?: Density;
}) {
  const normalizedItems = items
    .map((item) => (typeof item === "number" ? String(item) : item))
    .filter((item): item is string => Boolean(item));

  if (normalizedItems.length === 0) {
    return null;
  }

  return (
    <p
      className={cn(
        density === "compact"
          ? "text-meta mt-1.5 text-[0.8rem] lg:text-xs"
          : "text-meta mt-2",
        className,
      )}
    >
      {normalizedItems.join(" • ")}
    </p>
  );
}

export function ArchiveCardExcerpt({
  children,
  className,
  density = "regular",
}: {
  children?: ReactNode;
  className?: string;
  density?: Density;
}) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={cn(
        density === "compact"
          ? "text-ui-body mt-2 line-clamp-3 text-sm leading-6 lg:text-[0.95rem]"
          : "text-ui-body mt-3",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function ArchiveCardArrow({
  className,
  density = "regular",
}: {
  className?: string;
  density?: Density;
}) {
  const compact = density === "compact";

  return (
    <div
      className={cn(
        compact
          ? "mt-4 flex h-9 w-9 items-center justify-center rounded-full border group-hover:border-primary"
          : "mt-6 flex h-10 w-10 items-center justify-center rounded-full border group-hover:border-primary",
        className,
      )}
    >
      <ChevronRight
        className="text-border group-hover:text-primary"
        size={compact ? 20 : 24}
      />
    </div>
  );
}
