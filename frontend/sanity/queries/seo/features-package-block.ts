import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const featuresPackageBlockQuery = groq`
  _type == "features-package-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    cardStyle,
    title,
    subtitle,
    description,
    features[]{
      _key,
      icon,
      title,
      description,
      badge,
    },
    cta{
      ${linkQuery},
      buttonVariant
    },
  }
`;
