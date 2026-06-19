import { bodyQuery } from "./shared/body";
import { linkQuery } from "./shared/link";

// @sanity-typegen-ignore
export const FLEXIBLE_BUILDER_QUERY = `
  _type == "flexible-builder" => {
    _type,
    _key,
    padding,
    colorVariant,
    layout,
    columns[]{
      content[]{
        ${bodyQuery},
        _type == "inline-button" => {
          ...,
          link {
            ${linkQuery}
          }
        }
      }
    }
  }
`;
