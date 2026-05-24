import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const metricsRailBlockQuery = groq`
  _type == "metrics-rail-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    items[]{
      _key,
      value,
      label,
      brand,
    },
  }
`;
