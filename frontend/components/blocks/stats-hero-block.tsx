// @ts-nocheck
import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type StatsHeroBlock = Extract<Block, { _type: "stats-hero-block" }>;

export default function StatsHeroBlock({ blockStyles, title, description, stats }: StatsHeroBlock) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && <div className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</div>}
        {description && <p className="mx-auto mb-12 text-center text-muted-foreground">{description}</p>}
        {stats && stats.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((item: any) => (
              <div key={item._key} className="rounded-lg border p-6 text-center shadow-sm">
                <div className="text-4xl font-bold">{item.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
