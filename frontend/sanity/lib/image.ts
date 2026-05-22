import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "./env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

// Dummy builder that returns empty string for .url() calls
const EMPTY_IMAGE_BUILDER = {
  url: () => "",
  width: () => EMPTY_IMAGE_BUILDER,
  height: () => EMPTY_IMAGE_BUILDER,
  quality: () => EMPTY_IMAGE_BUILDER,
  format: () => EMPTY_IMAGE_BUILDER,
  fit: () => EMPTY_IMAGE_BUILDER,
  crop: () => EMPTY_IMAGE_BUILDER,
} as any;

export const urlFor = (source: SanityImageSource) => {
  // Guard against null/undefined asset
  const sourceObj = source as { asset?: { _id?: string; mimeType?: string } | null };
  if (!sourceObj?.asset) {
    return EMPTY_IMAGE_BUILDER;
  }

  const imageBuilder = builder.image(source);
  const isSvg = sourceObj.asset.mimeType === "image/svg+xml";

  if (isSvg) {
    return imageBuilder;
  }

  return imageBuilder.format("webp").fit("crop").quality(75);
};
