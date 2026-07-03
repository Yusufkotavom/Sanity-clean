// @ts-nocheck
import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type EeatBlock = Extract<Block, { _type: "eeat-block" }>;

export default function EeatBlock({ blockStyles, title, description, points }: EeatBlock) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && <div className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</div>}
        {description && <p className="mx-auto mb-12 text-center text-muted-foreground">{description}</p>}
        {points && points.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {points.map((item: any) => (
              <div key={item._key} className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-bold">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
