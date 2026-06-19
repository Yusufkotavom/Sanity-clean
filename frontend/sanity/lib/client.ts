import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: {
    enabled: process.env.NEXT_PUBLIC_SANITY_STEGA === "true",
    studioUrl: process.env.NEXT_PUBLIC_STUDIO_URL,
    filter: (props) => {
      const isConfigPath = props.sourcePath.some((path) =>
        [
          "colorVariant",
          "textAlign",
          "size",
          "aspectRatio",
          "indicators",
          "gridColumns",
          "cardStyle",
          "buttonVariant",
          "themePreset",
          "sectionWidth",
          "stackAlign",
          "layout",
          "backgroundWidth",
          "imagePosition",
          "alignment",
          "lightPrimary",
          "lightPrimaryForeground",
          "lightAccent",
          "lightRing",
          "darkPrimary",
          "darkPrimaryForeground",
          "darkAccent",
          "darkRing",
        ].includes(path as string),
      );

      if (isConfigPath) {
        return false;
      }

      return props.filterDefault(props);
    },
  },
});
