import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import { CardShell, type CardTheme } from "@/components/ui/card-shell";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type GridRow = Extract<Block, { _type: "grid-row" }>;
type GridColumn = NonNullable<NonNullable<GridRow["columns"]>>[number];
type GridPost = Extract<GridColumn, { _type: "grid-post" }>;

interface GridPostProps extends Omit<NonNullable<GridPost>, "_type" | "_key"> {
  cardTheme?: CardTheme | null;
  textAlign?: "left" | "center" | null;
  cardStyle?: "vertical" | "horizontal" | "classic" | null;
}

export default function GridPost({ cardTheme, textAlign, post }: GridPostProps) {
  if (!post) return null;
  const isCenter = textAlign === "center";

  const { title, slug, excerpt, image, categories } = post;

  return (
    <Link
      key={title}
      className="flex w-full ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
      href={`/blog/${slug?.current}`}
    >
      <CardShell
        theme={cardTheme}
        className="flex w-full flex-col justify-between transition ease-in-out group-hover:border-primary"
      >
        <div className={cn("flex flex-col", isCenter && "items-center text-center")}>
          {image && (image.asset?._id || !!(image as any)._url) && (
            <div className="mb-4 relative h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem] rounded-2xl overflow-hidden">
              <Image
                src={urlFor(image).width(900).quality(75).url()}
                alt={image.alt || ""}
                placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={image?.asset?.metadata?.lqip || ""}
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                quality={75}
              />
            </div>
          )}
          {title && (
            <div className={cn("flex items-center mb-4", isCenter ? "justify-center" : "justify-between")}>
              <h3 className="font-bold text-[1.5rem] leading-[1.2]">{title}</h3>
            </div>
          )}
          {categories && categories.length > 0 && (
            <div className={cn("flex flex-wrap gap-2 mb-4", isCenter && "justify-center")}>
              {categories.map((category, index) => (
                <Badge
                  key={`${category?._id || category?.title || "category"}-${index}`}
                  color="primary"
                >
                  {category.title}
                </Badge>
              ))}
            </div>
          )}
          {excerpt && <p>{excerpt}</p>}
        </div>
        <div className="mt-3 xl:mt-6 w-10 h-10 border rounded-full flex items-center justify-center group-hover:border-primary">
          <ChevronRight
            className="text-border group-hover:text-primary"
            size={24}
          />
        </div>
      </CardShell>
    </Link>
  );
}
