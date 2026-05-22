import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";
import { linkQuery } from "./shared/link";
import { blocksQuery } from "./shared/blocks";

export const SERVICE_QUERY = groq`*[_type == "service" && slug.current == $slug][0]{
  title,
  slug,
  excerpt,
  body[]{
    ${bodyQuery}
  },
  image{
    ${imageQuery}
  },
  deliverables,
  duration,
  startingPrice,
  currency,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  },
  reviews[]{
    _key,
    reviewerName,
    reviewerRole,
    reviewerImage{ ${imageQuery} },
    rating,
    reviewBody,
    datePublished,
    source,
    sourceUrl,
    verified,
  },
  aggregateRating{
    ratingValue,
    reviewCount,
    bestRating,
    ratingSource,
    sourceUrl,
  },
  ${blocksQuery},
  _createdAt,
  _updatedAt,
  ${metaQuery},
}`;

export const SERVICES_QUERY = groq`*[_type == "service" && defined(slug)] | order(featured desc, _createdAt desc){
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  duration,
  startingPrice,
  currency,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;

export const SERVICES_HOME_QUERY = groq`*[_type == "service" && defined(slug)] | order(featured desc, _createdAt desc) [0...3]{
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  duration,
  startingPrice,
  currency,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;

export const SERVICES_BY_CATEGORY_QUERY = groq`*[_type == "service" && defined(slug) && references(*[_type=="category" && slug.current==$slug][0]._id)] | order(featured desc, _createdAt desc){
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  duration,
  startingPrice,
  currency,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;

export const SERVICES_SLUGS_QUERY = groq`*[_type == "service" && defined(slug)]{slug}`;

export const RELATED_SERVICES_QUERY = groq`*[
  _type == "service" 
  && defined(slug) 
  && slug.current != $slug
  && count((categories[]->_id)[@ in $categoryIds]) > 0
] | order(featured desc, _createdAt desc) [0...4]{
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  duration,
  startingPrice,
  currency,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;
