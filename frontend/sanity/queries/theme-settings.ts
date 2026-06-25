import { groq } from "next-sanity";

export const THEME_SETTINGS_QUERY = groq`*[_type == "themeSettings"][0]{
  themeColors{
    themePreset,
    lightPrimary,
    lightPrimaryForeground,
    lightAccent,
    lightRing,
    darkPrimary,
    darkPrimaryForeground,
    darkAccent,
    darkRing
  },
  themeTokens{
    radiusScale,
    defaultCardVariant,
    accentTone,
    shadowDepth,
    cardPadding,
    defaultDensity
  },
  themeButtons{
    defaultVariant,
    size,
    radius,
    shadow,
    border,
    icon,
    iconPosition
  }
}`;
