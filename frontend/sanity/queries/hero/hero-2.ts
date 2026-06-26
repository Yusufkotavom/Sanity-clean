import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero2Query = groq`
  _type == "hero-2" => {
    _type,
    _key,
    useCard,
    colorVariant,
    tagLine,
    uiIcon{
      provider,
      name,
      svg
    },
    title,
    body[]{
      _key,
      ${bodyQuery}
    },
    images[]{
      _key,
      title,
      description,
      image{
        ${imageQuery}
      },
      link{
        ${linkQuery}
      },
    },
    links[]{
      _key,
      ${linkQuery}
    },
  }
`;
