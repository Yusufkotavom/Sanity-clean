import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const highlightsBlockQuery = groq`
  _type == "highlights-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    eyebrow,
    title,
    description,
    items[],
  }
`;
