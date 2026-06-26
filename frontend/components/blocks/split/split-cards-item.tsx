"use client";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import { cn } from "@/lib/utils";
import { PAGE_QUERY_RESULT, ColorVariant } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-cards-list" }
>;
type SplitCardItem = NonNullable<NonNullable<SplitCardsList["list"]>[number]>;

interface SplitCardsItemProps extends SplitCardItem {
  color?: ColorVariant;
}

export default function SplitCardsItem({
  color,
  tagLine,
  uiIcon,
  title,
  body,
}: SplitCardsItemProps) {
  return (
    <article className={cn(
      "group h-full border border-white/60 bg-white/75 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 hover:shadow-lg dark:border-white/15 dark:bg-white/[0.07] dark:hover:bg-white/12 rounded-[var(--radius-card,1rem)]",
      color === "primary" ? "text-background" : "text-foreground"
    )}>
      {tagLine && (
        <div className="mb-4 inline-flex items-center gap-3">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-background/80 transition-colors group-hover:border-foreground/30">
            <SanityIcon icon={uiIcon} className="size-5" fallbackSeed={tagLine || title || "card"} />
          </div>
          <span className="font-semibold text-lg">{tagLine}</span>
        </div>
      )}
      {!tagLine && uiIcon && (
        <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-foreground/15 bg-background/80 transition-colors group-hover:border-foreground/30">
          <SanityIcon icon={uiIcon} className="size-5" fallbackSeed={title || "card"} />
        </div>
      )}
      {title && (
        <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
          {title}
        </h3>
      )}
      {body && (
        <div className="text-muted-foreground leading-7">
          <PortableTextRenderer value={body} />
        </div>
      )}
    </article>
  );
}
