import { groq } from "next-sanity";
import { blocksQuery } from "./shared/blocks";

export const BLOCKS_SHOWCASE_QUERY = groq`
  *[_type in ["page", "post", "service", "product", "project"] && count(blocks) > 0] | order(_updatedAt desc)[0...200]{
    _id,
    _type,
    title,
    "slug": slug.current,
    ${blocksQuery}
  }
`;
