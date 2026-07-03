import SectionContainer from "@/components/ui/section-container";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type HighlightsBlock = Extract<Block, { _type: "highlights-block" }>;

export default function HighlightsBlock({ blockStyles, title, description, items }: any) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && <div className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</div>}
        {description && <p className="mx-auto mb-12 text-center text-muted-foreground">{description}</p>}
        {items && items.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((item: any, idx: number) => (
              <li key={item._key || idx} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{String(item)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionContainer>
  );
}
