import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";

export type CardThemeField =
  | "surface"
  | "variant"
  | "radius"
  | "shadow"
  | "padding"
  | "inherit";

export interface CardTheme {
  surface?: string | null;
  variant?: string | null;
  radius?: string | null;
  shadow?: string | null;
  padding?: string | null;
}

const FIELD_CLASS: Record<Exclude<CardThemeField, "inherit">, (v: string) => string> = {
  surface: (v) => `card-surface-${v}`,
  variant: (v) => `card-variant-${v}`,
  radius: (v) => `card-radius-${v}`,
  shadow: (v) => `card-shadow-${v}`,
  padding: (v) => `card-pad-${v}`,
};

function resolveField(value: string | null | undefined): string | undefined {
  const cleaned = stegaClean(value);
  if (!cleaned || cleaned === "inherit") return undefined;
  return cleaned;
}

export function resolveCardThemeClasses(theme?: CardTheme | null): string[] {
  if (!theme) return [];
  const classes: string[] = [];
  (Object.keys(FIELD_CLASS) as Array<Exclude<CardThemeField, "inherit">>).forEach(
    (field) => {
      const raw = theme[field] as string | null | undefined;
      const resolved = resolveField(raw);
      if (resolved) classes.push(FIELD_CLASS[field](resolved));
    },
  );
  return classes;
}

interface CardShellProps extends HTMLAttributes<HTMLDivElement> {
  theme?: CardTheme | null;
  as?: "div";
}

export function CardShell({
  theme,
  className,
  children,
  ...props
}: CardShellProps) {
  const themeClasses = resolveCardThemeClasses(theme);
  return (
    <div className={cn("card-shell", themeClasses, className)} {...props}>
      {children}
    </div>
  );
}

export default CardShell;
