import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const testimonialsBlockQuery = groq`
  _type == "testimonials-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    description,
    source,
    category,
    manualItems[]{
      _key,
      reviewerName,
      reviewerRole,
      rating,
      reviewBody,
    },
  }
`;
