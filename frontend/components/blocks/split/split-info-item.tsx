"use client";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/ui/glass-card";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitInfoList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-info-list" }
>;
type SplitInfoItem = NonNullable<SplitInfoList["list"]>[number];

export default function SplitCardsItem({
  image,
  uiIcon,
  title,
  body,
  tags,
}: SplitInfoItem) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 1,
  });

  return (
    <motion.div
      ref={ref}
      className="w-full"
    >
      <GlassCard
        className={cn(
          "rounded-3xl px-6 py-6 transition-colors duration-1000 ease-in-out lg:px-8 lg:py-8",
          isInView ? "border-primary/35 bg-foreground/85" : undefined,
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4 transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            {image && (image.asset?._id || !!(image as any)._url) && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image
                  src={urlFor(image).url()}
                  alt={image.alt || ""}
                  placeholder={
                    image?.asset?.metadata?.lqip &&
                    image?.asset?.mimeType !== "image/svg+xml"
                      ? "blur"
                      : undefined
                  }
                  blurDataURL={image?.asset?.metadata?.lqip || ""}
                  width={image.asset?.metadata?.dimensions?.width || 40}
                  height={image?.asset?.metadata?.dimensions?.height || 40}
                />
              </div>
            )}
            {!image?.asset?._id && !(image as any)?._url ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                <SanityIcon icon={uiIcon} className="size-5" />
              </div>
            ) : null}
            {title && (
              <div className="inline-flex items-center gap-2 text-xl font-semibold leading-[1.1]">
                {image?.asset?._id ? <SanityIcon icon={uiIcon} className="size-4" /> : null}
                <span>{title}</span>
              </div>
            )}
          </div>
          {body && <PortableTextRenderer value={body} />}
        </div>
        {tags && (
          <div
            className={cn(
              "mt-4 flex flex-wrap gap-3 transition-colors duration-1000 ease-in-out",
              isInView ? "text-background" : "text-foreground",
            )}
          >
            {tags.map((tag) => (
              <Badge
                key={tag}
                className={cn(
                  "transition-colors duration-1000 ease-in-out",
                  isInView
                    ? "bg-background text-foreground"
                    : "bg-foreground text-background",
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
