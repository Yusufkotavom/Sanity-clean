import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const faqsQuery = groq`
  _type == "faqs" => {
    _type,
    _key,
    padding,
    colorVariant,
    faqs[0..5]->{
      _id,
      question,
      answer,
      category,
    },
  }
`;

