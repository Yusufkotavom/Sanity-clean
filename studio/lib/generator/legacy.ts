export type LegacyTemplateLite = {
  _id?: string;
  title?: string;
  slug?: string;
  lane?: string;
  variant?: string;
  shellId?: string;
  topBlockCountDefault?: number | null;
};

export type GeneratorLegacySeed = {
  title: string;
  designFamily: string;
  shellId: string | null;
  topBlockCount: number;
  source: {
    legacyId: string | null;
    legacySlug: string | null;
    legacyVariant: string | null;
  };
};

const normalizeDesignFamily = (lane?: string) => {
  const value = `${lane || ""}`.trim().toLowerCase();

  if (!value) {
    return "generic";
  }

  if (["website", "software", "printing", "generic"].includes(value)) {
    return value;
  }

  return "generic";
};

const normalizeTopBlockCount = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
};

export const mapLegacyTemplateToGeneratorSeed = (
  legacy: LegacyTemplateLite,
): GeneratorLegacySeed => ({
  title: legacy.title?.trim() || "Migrated Legacy Template",
  designFamily: normalizeDesignFamily(legacy.lane),
  shellId: legacy.shellId?.trim() || null,
  topBlockCount: normalizeTopBlockCount(legacy.topBlockCountDefault),
  source: {
    legacyId: legacy._id?.trim() || null,
    legacySlug: legacy.slug?.trim() || null,
    legacyVariant: legacy.variant?.trim() || null,
  },
});
