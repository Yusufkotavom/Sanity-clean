// @ts-nocheck
import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type BenefitsBlock = Extract<Block, { _type: "benefits-block" }>;

export default function BenefitsBlock({ blockStyles, title, description, benefits }: BenefitsBlock) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && <div className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</div>}
        {description && <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">{description}</p>}
        {benefits && benefits.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
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
