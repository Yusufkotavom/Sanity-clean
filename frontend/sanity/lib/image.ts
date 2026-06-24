import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "./env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

// Builder that returns a fixed URL (for raw/external images not hosted on Sanity)
function rawUrlBuilder(url: string) {
  return {
    url: () => url,
    width: () => rawUrlBuilder(url),
    height: () => rawUrlBuilder(url),
    quality: () => rawUrlBuilder(url),
    format: () => rawUrlBuilder(url),
    fit: () => rawUrlBuilder(url),
    crop: () => rawUrlBuilder(url),
    auto: () => rawUrlBuilder(url),
    blur: () => rawUrlBuilder(url),
  };
}

// Dummy builder that returns empty string for .url() calls
const EMPTY_IMAGE_BUILDER = rawUrlBuilder("");

export const urlFor = (source: SanityImageSource) => {
  // ponytail: support raw URL (_url) and rawUrl field as fallback
  const s = source as { _url?: string; rawUrl?: string; asset?: { _id?: string; mimeType?: string } | null };
  if (s._url) return rawUrlBuilder(s._url);
  if (s.rawUrl) return rawUrlBuilder(s.rawUrl);

  // Guard against null/undefined asset
  if (!s?.asset) {
    return EMPTY_IMAGE_BUILDER;
  }

  const imageBuilder = builder.image(source);
  const isSvg = s.asset.mimeType === "image/svg+xml";

  if (isSvg) {
    return imageBuilder;
  }

  return imageBuilder.format("webp").fit("crop").quality(75);
};
