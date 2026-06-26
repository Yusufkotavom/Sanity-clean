import { cn } from "@/lib/utils";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TagLine from "@/components/ui/tag-line";
import { createElement } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitContent = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-content" }
>;

interface SplitContentProps extends SplitContent {
  noGap?: boolean;
}

export default function SplitContent({
  sticky,
  padding,
  noGap,
  tagLine,
  title,
  body,
  link,
  ...props
}: SplitContentProps & { image?: any }) {
  const image = props.image;
  return (
    <div
      className={cn(
        !sticky ? "flex flex-col justify-center" : undefined,
        padding?.top ? "pt-16 xl:pt-20" : undefined,
        padding?.bottom ? "pb-16 xl:pb-20" : undefined,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start",
          sticky ? "lg:sticky lg:top-56" : undefined,
          noGap ? "px-10" : undefined,
        )}
      >
        {image && (image.asset?._id || !!(image as any)._url) && (
          <div className="relative mb-8 w-full overflow-hidden rounded-[1.25rem] border border-white/40 bg-white/60 dark:border-white/10 dark:bg-white/5">
            <Image
              src={urlFor(image).url()}
              alt={image.alt || title || ""}
              width={image.asset.metadata?.dimensions?.width || 800}
              height={image.asset.metadata?.dimensions?.height || 600}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        )}
        {tagLine && <TagLine title={tagLine} element="h2" />}
        {title &&
          createElement(
            tagLine ? "h3" : "h2",
            {
              className: cn("my-4 font-semibold leading-[1.2]"),
            },
            title,
          )}
        {body && <PortableTextRenderer value={body} />}
        {link?.href && (
          <div className="flex flex-col">
            <Button
              className="mt-2  px-6"
              variant="default"
              size="lg"
              asChild
            >
              <Link
                href={link.href}
                target={link.target ? "_blank" : undefined}
              >
                {link.title}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
