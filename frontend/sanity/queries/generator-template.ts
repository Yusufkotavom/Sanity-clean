import { groq } from "next-sanity";
import { blocksQuery } from "./shared/blocks";

export const GENERATOR_TEMPLATE_BY_ID_QUERY = groq`
  *[_type == "generatorTemplate" && _id == $id][0]{
    title,
    routeBase,
    ${blocksQuery}
  }
`;
