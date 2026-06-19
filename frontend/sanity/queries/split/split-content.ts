import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const splitContentQuery = groq`
  _type == "split-content" => {
    _type,
    _key,
    sticky,
    padding,
    colorVariant,
    tagLine,
    title,
    body[]{
      _key,
      ${bodyQuery}
    },
    link{
      ${linkQuery}
    },
    image{
      asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      alt
    },
  }
`;
