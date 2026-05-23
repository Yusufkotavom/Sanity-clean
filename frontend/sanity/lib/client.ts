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
  },
});
