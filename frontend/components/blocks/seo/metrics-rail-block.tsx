// @ts-nocheck
import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type MetricsRailBlock = Extract<Block, { _type: "metrics-rail-block" }>;

export default function MetricsRailBlock({ blockStyles, items }: MetricsRailBlock) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {items && items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item: any) => (
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
