import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { linkQuery } from "./shared/link";

// @sanity-typegen-ignore
export const bannerSectionQuery = groq`
  _type == "banner-section" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    subtitle,
    bgType,
    bgImage{
      ${imageQuery}
    },
    size,
    align,
    link{
      ${linkQuery}
    }
  }
`;
