import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import GridCard from "./grid-card";
import PricingCard from "./pricing-card";
import GridPost from "./grid-post";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type GridRowBase = Extract<Block, { _type: "grid-row" }>;
type GridRow = Omit<GridRowBase, "cardLayout"> & { cardStyle?: "vertical" | "horizontal" | "classic" | null };
type GridColumn = NonNullable<NonNullable<GridRowBase["columns"]>[number]>;
const GRID_COLUMNS_CLASS: Record<string, string> = {
  "grid-cols-2": "lg:grid-cols-2",
  "grid-cols-3": "lg:grid-cols-3",
  "grid-cols-4": "lg:grid-cols-4",
};

const componentMap: {
  [K in GridColumn["_type"]]: React.ComponentType<
    Extract<GridColumn, { _type: K }>
  >;
} = {
  "grid-card": GridCard,
  "pricing-card": PricingCard,
  "grid-post": GridPost,
};

export default function GridRow({
  padding,
  colorVariant,
  gridColumns,
  textAlign,
  cardStyle,
  columns,
}: GridRow) {
  const cleanGridColumns = stegaClean(gridColumns);
  const cleanTextAlign = stegaClean(textAlign) as GridRow["textAlign"];
  const cleanCardStyle = stegaClean(cardStyle) as GridRow["cardStyle"];

  const resolvedGridColumnsClass = GRID_COLUMNS_CLASS[cleanGridColumns || ""] || "lg:grid-cols-3";
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      {columns && columns?.length > 0 && (
        <div className={cn("grid grid-cols-1 gap-6", resolvedGridColumnsClass)}>
          {columns.map((column) => {
            const Component = componentMap[column._type];
            if (!Component) {
              console.warn(
                `No component implemented for grid column type: ${column._type}`,
              );
              return <div data-type={column._type} key={column._key} />;
            }
            return (
              <Component
                {...(column as any)}
                color={colorVariant}
                textAlign={cleanTextAlign}
                cardStyle={cleanCardStyle}
                key={column._key}
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
