import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const heroVercelQuery = groq`
  _type == "hero-vercel" => {
    _type,
    _key,
    blockStyles,
    useCard,
    tagLine,
    title,
    description,
    ctaPrimary{
      ${linkQuery}
    },
    ctaSecondary{
      ${linkQuery}
    },
    cards[]{
      _key,
      _type,
      uiIcon{
        provider,
        name,
        svg
      },
      title,
      description,
      link{
        ${linkQuery}
      },
    },
    image{
      asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      alt
    },
  }
`;
