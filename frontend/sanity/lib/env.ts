export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-31";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rtpa6pgc",
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

const useCdnFlag = process.env.NEXT_PUBLIC_SANITY_USE_CDN;
export const useCdn =
  useCdnFlag !== undefined
    ? useCdnFlag.toLowerCase() !== "false"
    : process.env.NODE_ENV === "production";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
