import { cn } from "@/lib/utils";
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

interface SectionContainerProps {
  color?: ColorVariant | null;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  color = "background",
  padding,
  children,
  className,
}: SectionContainerProps) {
  const hasTopPadding = padding?.top ?? true;
  const hasBottomPadding = padding?.bottom ?? true;

  return (
    <div
      className={cn(
        "relative section-divider",
        COLOR_VARIANT_CLASSNAMES[color || "background"],
        hasTopPadding ? "pt-16 xl:pt-20" : undefined,
        hasBottomPadding ? "pb-16 xl:pb-20" : undefined,
        className
      )}
    >
      <div className="container relative">{children}</div>
    </div>
  );
}
