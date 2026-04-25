import { groq } from "next-sanity";
import { metaQuery } from "./shared/meta";
import { imageQuery } from "./shared/image";
import { blocksQuery } from "./shared/blocks";

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    topBlockCount,
    generator{
      programId,
      templateId,
      datasetId,
      rowKey,
      keywordKey,
      generatedAt,
      version,
      aiUsed
    },
    thumbnail{
      ${imageQuery}
    },
    ${blocksQuery},
    ${metaQuery},
  }
`;

export const PAGES_QUERY = groq`*[_type == "page" && defined(slug)] | order(title asc){
  title,
  slug,
}`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
