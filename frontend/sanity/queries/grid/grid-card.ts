import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const gridCardQuery = groq`
  _type == "grid-card" => {
    _type,
    _key,
    uiIcon{
      provider,
      name,
      svg
    },
    cardStyle,
    title,
    excerpt,
    image{
      ${imageQuery}
    },
    link{
      ${linkQuery}
    },
  }
`;
