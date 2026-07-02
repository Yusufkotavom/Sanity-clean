import SectionContainer from "@/components/ui/section-container";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { cn } from "@/lib/utils";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

type FlexibleBuilderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "flexible-builder" }
>;

export default function FlexibleBuilder({ blockStyles, 
      
      
      layout = "1-col",
      columns,
    }: FlexibleBuilderProps) {
  if (!columns || columns.length === 0) return null;

  // Determine grid template based on layout
  const getGridClass = (layoutString: string) => {
    switch (layoutString) {
      case "1-col":
        return "grid-cols-1";
      case "2-col-equal":
        return "grid-cols-1 md:grid-cols-2";
      case "2-col-30-70":
        return "grid-cols-1 md:grid-cols-[30%_1fr]";
      case "2-col-70-30":
        return "grid-cols-1 md:grid-cols-[1fr_30%]";
      case "3-col-equal":
        return "grid-cols-1 md:grid-cols-3";
      case "4-col-equal":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1";
    }
  };

  const gridClass = getGridClass(layout || "1-col");

  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className={cn("grid gap-8 w-full", gridClass)}>
        {columns.map((col: any, index: number) => (
          <div key={col._key || index} className="w-full">
            {col.content && (
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-xl prose-img:w-full">
                <PortableTextRenderer value={col.content} />
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
