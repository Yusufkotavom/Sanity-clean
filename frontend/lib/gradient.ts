/**
 * Color value from sanity-plugin-color-input.
 * Supports solid colors and linear gradients.
 */
export type ColorValue = {
  hex?: string | null;
  isGradient?: boolean | null;
  css?: string | null;
};

/**
 * Resolve a ColorValue to a CSS background string.
 * - If gradient mode: returns the `css` field (e.g. "linear-gradient(180deg, #ff0000, #00ff00)")
 * - If solid mode: returns the `hex` field (e.g. "#ff0000")
 * - If empty: returns undefined
 */
export function resolveColorBg(color?: ColorValue | null): string | undefined {
  if (!color) return undefined;
  if (color.isGradient && color.css) return color.css;
  if (color.hex) return color.hex;
  return undefined;
}

/**
 * Build a CSS style object for background from a ColorValue.
 * Uses backgroundImage for gradients, backgroundColor for solid.
 */
export function colorToStyle(color?: ColorValue | null): React.CSSProperties | undefined {
  if (!color) return undefined;
  if (color.isGradient && color.css) {
    return { backgroundImage: color.css };
  }
  if (color.hex) {
    return { backgroundColor: color.hex };
  }
  return undefined;
}

/**
 * Build a CSS style for card background (uses --card-bg variable for solid, backgroundImage for gradient).
 */
export function colorToCardStyle(color?: ColorValue | null): React.CSSProperties | undefined {
  if (!color) return undefined;
  if (color.isGradient && color.css) {
    return { backgroundImage: color.css };
  }
  if (color.hex) {
    return { '--card-bg': color.hex } as React.CSSProperties;
  }
  return undefined;
}
