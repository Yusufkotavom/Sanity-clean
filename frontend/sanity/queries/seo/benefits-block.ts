import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const benefitsBlockQuery = groq`
  _type == "benefits-block" => {
    _type,
    _key,
    blockStyles,
    title,
    subtitle,
    description,
    benefits[]{
      _key,
      icon,
      title,
      description,
      badge,
      badgeIcon,
    },
  }
`;
