import { groq } from "next-sanity";
import { gridCardQuery } from "../grid/grid-card";
import { pricingCardQuery } from "../grid/pricing-card";
import { gridPostQuery } from "../grid/grid-post";

// @sanity-typegen-ignore
export const gridRowQuery = groq`
  _type == "grid-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    textAlign,
    cardStyle,
    gridColumns,
    columns[0..11]{
      _key,
      ${gridCardQuery},
      ${pricingCardQuery},
      ${gridPostQuery},
    },
  }
`;
