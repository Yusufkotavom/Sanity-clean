import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SanityIcon from "@/components/icons/sanity-icon";
import type { SanityIconValue } from "@/components/icons/sanity-icon";

type EyebrowProps = {
  icon?: SanityIconValue | ReactNode | null;
  title?: string | null;
  className?: string;
  variant?: "default" | "subtle" | "outline" | "ghost";
  size?: "sm" | "md";
};

const VARIANT_CLASSES = {
  default:
    "border border-foreground/15 bg-primary/10 text-primary shadow-sm dark:bg-primary/15 dark:border-primary/20",
  subtle:
    "border border-foreground/10 bg-foreground/5 text-foreground/70 dark:bg-white/5 dark:border-white/10 dark:text-foreground/60",
  outline:
    "border border-foreground/15 bg-transparent text-foreground/70 dark:border-white/15 dark:text-foreground/60",
  ghost:
    "border border-transparent bg-transparent text-foreground/55 dark:text-foreground/45",
} as const;

const SIZE_CLASSES = {
  sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
  md: "px-3 py-1 text-xs gap-2",
} as const;

function isSanityIcon(value: SanityIconValue | ReactNode): value is SanityIconValue {
  return typeof value === "string" || (typeof value === "object" && value !== null && !("type" in value));
}

export default function Eyebrow({
  icon,
  title,
  className,
  variant = "default",
  size = "md",
}: EyebrowProps) {
  if (!icon && !title) return null;

  return (
    <div
      className={cn(
        "mb-4 inline-flex items-center font-medium leading-none rounded-full whitespace-nowrap",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {icon && (
        isSanityIcon(icon)
          ? <SanityIcon icon={icon} className="size-3.5 shrink-0" />
          : <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>
      )}
      {title && <span>{title}</span>}
    </div>
  );
}
