import { groq } from "next-sanity";

export const OG_SETTINGS_QUERY = groq`*[_type == "ogSettings"][0]{
  _id,
  _type,
  eyebrow,
  defaultBadge,
  gradientFrom,
  gradientTo,
  accentColor,
  textColor,
  fontFamily,
  fontUrl,
  titleMaxLength,
  titleFontSize,
  titleLineHeight,
  titleLetterSpacingEm,
  titleClampLines,
  canvasPaddingX,
  canvasPaddingY,
  headerDotSize,
  badgeBorderWidth,
  badgeBorderRadius,
  footerBorderColor,
  footerBorderOpacity,
  overlayEnabled,
  overlayOpacity
}`;
