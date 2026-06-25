import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import { SectionPadding, ColorVariant } from "@/sanity.types";

const COLOR_VARIANT_CLASSNAMES: Record<NonNullable<ColorVariant>, string> = {
  accent: "bg-accent text-accent-foreground",
  background: "bg-background",
  card: "bg-card",
  destructive: "bg-destructive text-primary-foreground",
  muted: "bg-muted",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  transparent: "bg-transparent",
};

export interface SectionStyle {
  bg?: string | null;
  density?: string | null;
  maxWidth?: string | null;
  radius?: string | null;
  align?: string | null;
}

const MAXWIDTH_CLASS: Record<string, string | undefined> = {
  full: "max-w-none",
  default: undefined,
  narrow: "max-w-2xl",
  prose: "max-w-prose",
};

const RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-[1.6rem]",
};

function resolve(value?: string | null): string | undefined {
  const cleaned = stegaClean(value);
  return cleaned && cleaned !== "inherit" ? cleaned : undefined;
}

interface SectionContainerProps {
  color?: ColorVariant | null;
  padding?: SectionPadding | null;
  sectionStyle?: SectionStyle | null;
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  color,
  padding,
  sectionStyle,
  children,
  className,
}: SectionContainerProps) {
  const ss = sectionStyle ?? null;
  const useNew = !!ss;

  const resolvedBg = resolve(ss?.bg) || (color ?? "background");
  const bgClass = COLOR_VARIANT_CLASSNAMES[resolvedBg as NonNullable<ColorVariant>] ?? "bg-background";

  const density = resolve(ss?.density);
  const maxWidth = resolve(ss?.maxWidth);
  const radius = resolve(ss?.radius);
  const align = resolve(ss?.align);

  const hasTopPadding = padding?.top ?? true;
  const hasBottomPadding = padding?.bottom ?? true;

  return (
    <div
      className={cn(
        "relative section-divider",
        bgClass,
        useNew
          ? cn(
              "py-[var(--section-py)] xl:py-[var(--section-py-xl)]",
              density && `section-density-${density}`,
            )
          : cn(
              hasTopPadding ? "pt-16 xl:pt-20" : undefined,
              hasBottomPadding ? "pb-16 xl:pb-20" : undefined,
            ),
        className,
      )}
    >
      <div className="container relative">
        <div
          className={cn(
            "relative",
            maxWidth && MAXWIDTH_CLASS[maxWidth],
            align === "center" && "mx-auto text-center",
            radius && RADIUS_CLASS[radius],
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
