// @ts-nocheck
import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type MicroBadgesBlock = Extract<Block, { _type: "micro-badges-block" }>;

export default function MicroBadgesBlock({ blockStyles, badges }: MicroBadgesBlock) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {badges && badges.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {badges.map((item: any) => (
              <div key={item._key} className="rounded-lg border p-6 shadow-sm">
                <div className="text-xl font-bold">{item.label}</div>
                {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
