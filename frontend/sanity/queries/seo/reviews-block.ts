import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const reviewsBlockQuery = groq`
  _type == "reviews-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    reviews[]{
      _key,
      reviewerName,
      reviewerRole,
      rating,
      reviewBody,
    },
  }
`;
