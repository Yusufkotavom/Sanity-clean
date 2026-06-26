import { groq } from "next-sanity";
import { gridCardQuery } from "./grid/grid-card";
import { pricingCardQuery } from "./grid/pricing-card";
import { gridPostQuery } from "./grid/grid-post";

// @sanity-typegen-ignore
export const tabsSectionQuery = groq`
  _type == "tabs-section" => {
    _type,
    _key,
    padding,
    colorVariant,
    tabs[]{
      _key,
      label,
      grid{
        _type,
        _key,
        sectionStyle{
          bg,
          density,
          maxWidth,
          radius,
          align
        },
        cardTheme{
          surface,
          variant,
          radius,
          shadow,
          padding
        },
        textAlign,
        "cardStyle": coalesce(cardStyle, cardLayout, "vertical"),
        gridColumns,
        columns[0..11]{
          _key,
          ${gridCardQuery},
          ${pricingCardQuery},
          ${gridPostQuery},
        }
      }
    }
  }
`;
