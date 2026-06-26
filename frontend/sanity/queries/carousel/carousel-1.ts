import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";
import { linkQuery } from "../shared/link";
import { gridCardQuery } from "../grid/grid-card";
import { pricingCardQuery } from "../grid/pricing-card";
import { gridPostQuery } from "../grid/grid-post";

// @sanity-typegen-ignore
export const carousel1Query = groq`
  _type == "carousel-1" => {
    _type,
    _key,
    padding,
    colorVariant,
    size,
    orientation,
    indicators,
    contentType,
    cardTheme{
      surface,
      variant,
      radius,
      shadow,
      padding
    },
    textAlign,
    "cardStyle": coalesce(cardStyle, cardLayout, "vertical"),
    columns[0..11]{
      _key,
      ${gridCardQuery},
      ${pricingCardQuery},
      ${gridPostQuery},
    },
    images[0..9]{
      _key,
      title,
      description,
      link{
        ${linkQuery}
      },
      ${imageQuery}
    },
  }
`;

