import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const companyInfoQuery = groq`
  _type == "company-info" => {
    _type,
    _key,
    blockStyles,
    title,
    description,
  }
`;
