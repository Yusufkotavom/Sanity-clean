import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const heroVercelQuery = groq`
  _type == "hero-vercel" => {
    _type,
    _key,
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
    },
    image{
      asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      alt
    },
  }
`;
