import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const featuresPackageBlockQuery = groq`
  _type == "features-package-block" => {
    _type,
    _key,
    blockStyles,
    cardStyle,
    title,
    subtitle,
    description,
    features[]{
      _key,
      icon{
        provider,
        name,
        svg
      },
      title,
      description,
      badge,
      link{
        ${linkQuery}
      },
    },
    cta{
      ${linkQuery},
      buttonVariant
    },
  }
`;
