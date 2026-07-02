import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const whatsappCtaQuery = groq`
  _type == "whatsapp-cta" => {
    _type,
    _key,
    blockStyles,
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
    secondaryLink{
      ${linkQuery}
    },
  }
`;
