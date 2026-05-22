import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";
import { linkQuery } from "./shared/link";
import { blocksQuery } from "./shared/blocks";

export const PRODUCT_QUERY = groq`*[_type == "product" && slug.current == $slug][0]{
  title,
  slug,
  excerpt,
  body[]{
    ${bodyQuery}
  },
  image{
    ${imageQuery}
  },
  gallery[]{
    ${imageQuery}
  },
  price,
  currency,
  availability,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  },
  affiliateLinks[]{
    _key,
    platform,
    label,
    url,
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

export const PRODUCTS_QUERY = groq`*[_type == "product" && defined(slug)] | order(featured desc, _createdAt desc){
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  price,
  currency,
  availability,
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

export const PRODUCTS_HOME_QUERY = groq`*[_type == "product" && defined(slug)] | order(featured desc, _createdAt desc) [0...3]{
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  price,
  currency,
  availability,
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

export const PRODUCTS_BY_CATEGORY_QUERY = groq`*[_type == "product" && defined(slug) && references(*[_type=="category" && slug.current==$slug][0]._id)] | order(featured desc, _createdAt desc){
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  price,
  currency,
  availability,
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

export const PRODUCTS_SLUGS_QUERY = groq`*[_type == "product" && defined(slug)]{slug}`;

export const RELATED_PRODUCTS_QUERY = groq`*[
  _type == "product" 
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
  price,
  currency,
  availability,
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
