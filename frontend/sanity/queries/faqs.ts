import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const faqsQuery = groq`
  _type == "faqs" => {
    _type,
    _key,
    blockStyles,
    title,
    description,
    source,
    faqs[0..5]->{
      _id,
      question,
      answer,
      category,
    },
    manualItems[]{
      _key,
      question,
      answer,
    },
  }
`;
