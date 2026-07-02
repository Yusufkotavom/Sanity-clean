"use client";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Eyebrow from "@/components/ui/eyebrow";
import { CardShell } from "@/components/ui/card-shell";
import { cn } from "@/lib/utils";
import { PAGE_QUERY_RESULT,  } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-cards-list" }
>;
type SplitCardItem = NonNullable<NonNullable<SplitCardsList["list"]>[number]>;

interface SplitCardsItemProps extends SplitCardItem {
}

export default function SplitCardsItem({
  
  tagLine,
  uiIcon,
  title,
  body,
}: SplitCardsItemProps) {
  return (
    <CardShell className={cn(
      "group h-full p-6 transition-all duration-200 hover:scale-[1.02] hover:border-primary/35",
      "text-foreground"
    )}>
      <Eyebrow icon={uiIcon} title={tagLine} variant="outline" size="md" />
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
    </CardShell>
  );
}
