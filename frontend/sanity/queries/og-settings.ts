import { groq } from "next-sanity";

export const OG_SETTINGS_QUERY = groq`*[_type == "ogSettings"][0]{
  _id,
  ogBaseUrl,
  brandName,
  logoUrl,
  ctaText,
  showDescription,
  showCta,
  fallbackImage,
  images[]{
    asset->{_id, url},
    alt,
    category
  }
}`;
