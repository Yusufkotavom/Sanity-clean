import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { bodyQuery } from "../shared/body";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const cta1Query = groq`
  _type == "cta-1" => {
    _type,
    _key,
    blockStyles,
    backgroundWidth,
    useCard,
    sectionWidth,
    stackAlign,
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
    links[]{
      _key,
      ${linkQuery}
    },
    imagePosition,
    image{
      ${imageQuery}
    },
  }
`;
