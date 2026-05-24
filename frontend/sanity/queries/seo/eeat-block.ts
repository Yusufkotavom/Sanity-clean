import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const eeatBlockQuery = groq`
  _type == "eeat-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    eyebrow,
    title,
    description,
    points[]{
      _key,
      title,
      description,
    },
  }
`;
