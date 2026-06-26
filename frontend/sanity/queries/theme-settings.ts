import { groq } from "next-sanity";

export const THEME_SETTINGS_QUERY = groq`*[_type == "themeSettings"][0]{
  themeColors{
    themePreset,
    lightColors{
      lightPrimary{ hex },
      lightPrimaryForeground{ hex },
      lightAccent{ hex },
      lightRing{ hex }
    },
    darkColors{
      darkPrimary{ hex },
      darkPrimaryForeground{ hex },
      darkAccent{ hex },
      darkRing{ hex }
    },
    lightGradient{
      enabled,
      direction,
      from{ hex },
      via{ hex },
      to{ hex }
    },
    darkGradient{
      enabled,
      direction,
      from{ hex },
      via{ hex },
      to{ hex }
    }
  },
  themeTokens{
    radiusScale,
    defaultCardVariant,
    accentTone,
    shadowDepth,
    cardPadding,
    cardColors{
      cardBg{ hex },
      cardFg{ hex },
      cardBorder{ hex }
    }
  },
  themeBlocks{
    defaultDensity,
    sectionColors{
      sectionBg{ hex },
      sectionFg{ hex },
      sectionBorder{ hex }
    },
    panelColors{
      panelBg{ hex },
      panelBorder{ hex }
    }
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
