"use client";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import GlassCard from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
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
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 1,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(color === "primary" ? "text-background" : undefined)}
    >
      <GlassCard
        className={cn(
          "w-full rounded-3xl px-6 py-6 transition-colors duration-1000 ease-in-out lg:px-8 lg:py-8",
          isInView ? "border-primary/35 bg-foreground/85" : undefined,
        )}
      >
      {tagLine && (
        <div
          className={cn(
            "inline-flex items-center gap-2 font-bold text-2xl lg:text-3xl transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
            color === "primary" ? "text-background" : undefined,
          )}
        >
          <SanityIcon icon={uiIcon} className="size-5" />
          {tagLine}
        </div>
      )}
      {title && (
        <div
          className={cn(
            "my-2 font-semibold text-xl transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
            color === "primary" ? "text-background" : undefined,
          )}
        >
          {title}
        </div>
      )}
      {body && (
        <div
          className={cn(
            "transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
          )}
        >
          <PortableTextRenderer value={body} />
        </div>
      )}
      </GlassCard>
    </motion.div>
  );
}
