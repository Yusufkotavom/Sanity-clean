/** Lightweight stega-clean replacement. Strips invisible stega characters if present. */
export const cleanString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, "").trim();
};
