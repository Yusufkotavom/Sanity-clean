import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const microBadgesBlockQuery = groq`
  _type == "micro-badges-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    badges[]{
      _key,
      label,
      description,
    },
  }
`;
