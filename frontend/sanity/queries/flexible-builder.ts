import { bodyQuery } from "./shared/body";
import { linkQuery } from "./shared/link";

// @sanity-typegen-ignore
export const FLEXIBLE_BUILDER_QUERY = `
  _type == "flexible-builder" => {
    _type,
    _key,
    blockStyles,
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
