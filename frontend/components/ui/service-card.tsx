import {
  ArchiveCardArrow,
  ArchiveCardExcerpt,
  ArchiveCardMedia,
  ArchiveCardMeta,
  ArchiveCardShell,
  ArchiveCardTitle,
} from "@/components/ui/archive-card";
import TaxonomyBadgeList from "@/components/ui/taxonomy-badge-list";
import SanityIcon, { type SanityIconValue } from "@/components/icons/sanity-icon";

export default function ServiceCard({
  title,
  slug,
  excerpt,
  image,
  duration,
  startingPrice,
  currency,
  categories,
  cta,
  priority,
}: {
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  image?: any;
  duration?: string;
  startingPrice?: number;
  currency?: string;
  categories?: Array<{ _id?: string; title?: string }>;
  cta?: {
    title?: string;
    icon?: SanityIconValue;
    uiIcon?: SanityIconValue;
  };
  priority?: boolean;
}) {
  return (
    <ArchiveCardShell href={`/services/${slug?.current || ""}`} density="compact">
      <div>
        <ArchiveCardMedia image={image} heightVariant="compact" className="mb-3 lg:mb-3.5" priority={priority} />
        <ArchiveCardTitle density="compact">{title}</ArchiveCardTitle>
        <ArchiveCardMeta
          density="compact"
          items={[
            duration,
            typeof startingPrice === "number"
              ? `From ${currency || "IDR"} ${startingPrice}`
              : undefined,
          ]}
        />
        <TaxonomyBadgeList
          items={categories}
          size="compact"
          className="mt-2.5 gap-1.5"
        />
        <ArchiveCardExcerpt density="compact">{excerpt}</ArchiveCardExcerpt>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/85">
          <SanityIcon icon={cta?.uiIcon || cta?.icon} className="size-4" />
          {cta?.title || "View details"}
        </span>
        <ArchiveCardArrow density="compact" className="mt-0" />
      </div>
    </ArchiveCardShell>
  );
}
