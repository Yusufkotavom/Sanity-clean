import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant } from "@/sanity.types";

type GridFeatureItem = {
  readonly _key: string;
  readonly title: string;
  readonly description: string;
};

type GridFeatureBlock = {
  readonly _type: string;
  readonly _key: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly columns?: 2 | 3 | 4;
  readonly items: readonly GridFeatureItem[];
  readonly colorVariant?: ColorVariant | null;
};

type GridFeatureProps = {
  readonly block: GridFeatureBlock;
};

const columnClassByCount: Record<NonNullable<GridFeatureBlock["columns"]>, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function GridFeature({ block }: GridFeatureProps) {
  const columnClass = columnClassByCount[block.columns ?? 3];
  const color = (block.colorVariant as ColorVariant) || undefined;

  return (
    <SectionContainer color={color}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
            {block.title}
          </h2>
          {block.subtitle ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              {block.subtitle}
            </p>
          ) : null}
        </div>
        <div className={cn("mt-10 grid gap-5 md:grid-cols-2", columnClass)}>
          {block.items.map((item) => (
            <article
              key={item._key}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold tracking-normal text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
