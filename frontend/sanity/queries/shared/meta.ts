import { imageQuery } from "./image";

export const metaQuery = `
  meta{
    title,
    description,
    canonicalUrl,
    focusKeyword,
    secondaryKeywords,
    keywords,
    openGraph{
      title,
      description
    },
    noindex,
    image{
      ${imageQuery}
    }
  }
`;
