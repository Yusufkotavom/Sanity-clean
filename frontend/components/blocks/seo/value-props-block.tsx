import SectionContainer from "@/components/ui/section-container";
import { CheckCircle2 } from "lucide-react";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type ValuePropsBlock = Extract<Block, { _type: "value-props-block" }>;

export type ValueProps = ValuePropsBlock;

export default function ValuePropsBlock({
  blockStyles,
  title,
  description,
  valueProps,
}: any) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <div className="mb-3 text-center text-3xl font-bold md:text-4xl">
            {title}
          </div>
        )}
        {description && (
          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
            {description}
          </p>
        )}

        {valueProps && valueProps.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((item: any) => (
              <div
                key={item._key}
                className="rounded-lg border p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  {item.icon && (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
