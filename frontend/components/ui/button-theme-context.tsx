import { createContext, useContext, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";

export type ButtonVariantValue =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

export type ButtonSizeValue = "sm" | "default" | "lg";

export type ButtonRadiusValue = "none" | "sm" | "md" | "lg" | "pill";

export type ButtonShadowValue = "none" | "sm" | "md" | "lg";

export type ButtonBorderValue = "none" | "subtle" | "strong";

export type ButtonIconValue =
  | "none"
  | "arrow-right"
  | "chevron-right"
  | "external-link"
  | "phone"
  | "mail";

export type ButtonIconPosition = "left" | "right";

export interface ButtonThemeConfig {
  variant: ButtonVariantValue;
  size: ButtonSizeValue;
  radius: ButtonRadiusValue;
  shadow: ButtonShadowValue;
  border: ButtonBorderValue;
  icon: ButtonIconValue;
  iconPosition: ButtonIconPosition;
}

export const DEFAULT_BUTTON_THEME: ButtonThemeConfig = {
  variant: "default",
  size: "default",
  radius: "md",
  shadow: "md",
  border: "subtle",
  icon: "none",
  iconPosition: "right",
};

const ButtonThemeContext = createContext<ButtonThemeConfig>(DEFAULT_BUTTON_THEME);

export function useButtonTheme(): ButtonThemeConfig {
  return useContext(ButtonThemeContext);
}

export interface ButtonThemeContextValue {
  defaultVariant?: string | null;
  size?: string | null;
  radius?: string | null;
  shadow?: string | null;
  border?: string | null;
  icon?: string | null;
  iconPosition?: string | null;
}

function resolve<T extends string>(
  value: string | null | undefined,
  fallback: T,
): T {
  const cleaned = stegaClean(value);
  return (cleaned && cleaned !== "inherit" ? cleaned : fallback) as T;
}

export function resolveButtonTheme(
  raw: ButtonThemeContextValue | null | undefined,
): ButtonThemeConfig {
  if (!raw) return DEFAULT_BUTTON_THEME;
  return {
    variant: resolve(raw.defaultVariant, DEFAULT_BUTTON_THEME.variant),
    size: resolve(raw.size, DEFAULT_BUTTON_THEME.size),
    radius: resolve(raw.radius, DEFAULT_BUTTON_THEME.radius),
    shadow: resolve(raw.shadow, DEFAULT_BUTTON_THEME.shadow),
    border: resolve(raw.border, DEFAULT_BUTTON_THEME.border),
    icon: resolve(raw.icon, DEFAULT_BUTTON_THEME.icon),
    iconPosition: resolve(raw.iconPosition, DEFAULT_BUTTON_THEME.iconPosition),
  };
}

const RADIUS_CLASS: Record<ButtonRadiusValue, string> = {
  none: "btn-radius-none",
  sm: "btn-radius-sm",
  md: "btn-radius-md",
  lg: "btn-radius-lg",
  pill: "btn-radius-pill",
};
const SHADOW_CLASS: Record<ButtonShadowValue, string> = {
  none: "btn-shadow-none",
  sm: "btn-shadow-sm",
  md: "btn-shadow-md",
  lg: "btn-shadow-lg",
};
const BORDER_CLASS: Record<ButtonBorderValue, string> = {
  none: "btn-border-none",
  subtle: "btn-border-subtle",
  strong: "btn-border-strong",
};

export function buttonThemeTokenClasses(theme: ButtonThemeConfig): string {
  return cn(
    RADIUS_CLASS[theme.radius],
    SHADOW_CLASS[theme.shadow],
    BORDER_CLASS[theme.border],
  );
}

interface ButtonThemeProviderProps {
  value: ButtonThemeContextValue | null | undefined;
  scope?: "global" | "local";
  className?: string;
  children: ReactNode;
}

export function ButtonThemeProvider({
  value,
  scope = "global",
  className,
  children,
}: ButtonThemeProviderProps) {
  const theme = useMemo(() => resolveButtonTheme(value), [value]);
  const tokenClasses = buttonThemeTokenClasses(theme);

  if (scope === "global") {
    return (
      <ButtonThemeContext.Provider value={theme}>
        {children}
      </ButtonThemeContext.Provider>
    );
  }

  return (
    <ButtonThemeContext.Provider value={theme}>
      <div className={cn(tokenClasses, className)}>{children}</div>
    </ButtonThemeContext.Provider>
  );
}

export default ButtonThemeProvider;
