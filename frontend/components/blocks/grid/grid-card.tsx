import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import { CardShell, type CardTheme } from "@/components/ui/card-shell";
import SanityIcon from "@/components/icons/sanity-icon";
import PortableTextRenderer from "@/components/portable-text-renderer";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type GridRow = Extract<Block, { _type: "grid-row" }>;
type GridColumn = NonNullable<NonNullable<GridRow["columns"]>>[number];
type GridCard = Extract<GridColumn, { _type: "grid-card" }>;

interface GridCardProps extends Omit<GridCard, "_type" | "_key"> {
  cardTheme?: CardTheme | null;
  cardStyle?: "vertical" | "horizontal" | "classic" | null;
  textAlign?: "left" | "center" | null;
}

export default function GridCard({
  cardTheme,
  cardStyle,
  textAlign,
  uiIcon,
  title,
  excerpt,
  image,
  link,
}: GridCardProps) {
  const isClassic = cardStyle === "classic";
  const isCenter = textAlign === "center";
  const isHorizontal = cardStyle === "horizontal";

  return (
    <CardShell
      theme={cardTheme}
      className={cn(
        "group flex w-full flex-col justify-between transition ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "group-hover:border-primary/35",
      )}
    >
      <div className={cn(isHorizontal && "flex items-start gap-4")}>
        {image && (image.asset?._id || !!(image as any)._url) && !isHorizontal && (
          <div className="relative mb-4 h-[15rem] overflow-hidden rounded-[1.15rem] border border-white/40 bg-white/60 sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem] dark:border-white/10 dark:bg-white/5">
            <Image
              src={urlFor(image).width(900).quality(75).url()}
              alt={image.alt || ""}
              placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ""}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              quality={75}
            />
          </div>
        )}
        {isHorizontal && (
          <div className="shrink-0 pt-1">
            <div
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg border border-foreground/15 bg-background/80",
              )}
            >
              <SanityIcon icon={uiIcon} className="size-4" fallbackSeed={title || "icon"} />
            </div>
          </div>
        )}
        <div className={cn(isCenter && "text-center")}>
          {title && (
            <div className="mb-3">
              {!isHorizontal && (
                <div
                  className={cn(
                    "inline-flex items-center gap-2",
                    !isClassic && "mb-3 size-10 justify-center rounded-lg border border-foreground/15 bg-background/80",
                    isCenter && "mx-auto",
                  )}
                >
                  <SanityIcon icon={uiIcon} className={cn("size-5", !isClassic && "size-4")} fallbackSeed={title || "icon"} />
                </div>
              )}
              <h3 className="text-xl font-semibold leading-tight md:text-2xl">{title}</h3>
            </div>
          )}
          {excerpt ? (
            <div className="text-sm leading-6 text-muted-foreground md:text-base prose prose-sm prose-neutral dark:prose-invert">
              <PortableTextRenderer value={excerpt as any} />
            </div>
          ) : null}
        </div>
      </div>
      {link?.title?.trim() ? (
        <Button
          className={cn("mt-6 self-start px-6", isCenter && "self-center")}
          variant={link?.buttonVariant || "default"}
          asChild
        >
          <Link
            href={link?.href ?? "#"}
            target={link?.target ? "_blank" : undefined}
            rel={link?.target ? "noopener" : undefined}
          >
            <SanityIcon icon={link?.uiIcon || link?.icon} className="size-4" />
            <span>{link.title.trim()}</span>
          </Link>
        </Button>
      ) : null}
    </CardShell>
  );
}
