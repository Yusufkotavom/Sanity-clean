import SectionContainer from "@/components/ui/section-container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselCounter,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import GridCard from "@/components/blocks/grid/grid-card";
import PricingCard from "@/components/blocks/grid/pricing-card";
import GridPost from "@/components/blocks/grid/grid-post";

const CAROUSEL_SIZES = {
  one: "basis-full",
  two: "basis-full md:basis-1/2",
  three: "basis-full md:basis-1/2 lg:basis-1/3",
} as const;

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "auto": "",
};

type CarouselSize = keyof typeof CAROUSEL_SIZES;

interface CarouselImage {
  alt?: string;
  title?: string;
  description?: string;
  link?: {
    href?: string;
    target?: boolean;
  };
  asset?: any;
}

interface Carousel1Props {
  blockStyles?: any;
  size?: CarouselSize | null;
  indicators?: "none" | "dots" | "count" | null;
  aspectRatio?: string | null;
  contentType?: "images" | "grid" | null;
  images?: CarouselImage[] | null;
  columns?: any[] | null;
  cardTheme?: any | null;
  cardStyle?: "vertical" | "horizontal" | "classic" | null;
  textAlign?: "left" | "center" | null;
}

const gridComponentMap = {
  "grid-card": GridCard,
  "pricing-card": PricingCard,
  "grid-post": GridPost,
} as const;

export default function Carousel1({ blockStyles, 
      
      
      size = "one",
      indicators = "none",
      aspectRatio = "auto",
      contentType = "images",
      images,
      columns,
      cardTheme,
      cardStyle = "vertical",
      textAlign = "left",
    }: Carousel1Props) {
  const cleanSize = stegaClean(size) as CarouselSize;
  const cleanIndicators = stegaClean(indicators);
  const cleanAspectRatio = stegaClean(aspectRatio);
  const cleanContentType = stegaClean(contentType) || "images";
  const cleanCardStyle = stegaClean(cardStyle) as any;
  const cleanTextAlign = stegaClean(textAlign) as any;

  const ratioClass = ASPECT_RATIO_CLASSES[cleanAspectRatio || "auto"] || "";

  const hasContent =
    cleanContentType === "grid"
      ? columns && columns.length > 0
      : images && images.length > 0;

  return (
    <SectionContainer blockStyles={blockStyles}>
      {hasContent && (
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {cleanContentType === "images" && images
              ? images.map((image, index) => {
                  const isSvgImage =
                    image?.asset?.mimeType === "image/svg+xml" ||
                    image?.asset?.url?.endsWith(".svg");

                  const slideContent = (
                    <div
                      className={cn(
                        "relative mx-auto overflow-hidden rounded-2xl group",
                        ratioClass || "h-[30rem] md:h-[25rem] xl:h-[30rem]",
                        cleanSize === "one" ? "max-w-[35rem]" : undefined,
                      )}
                    >
                      {isSvgImage ? (
                        <img
                          className="object-cover w-full h-full"
                          src={urlFor(image).url()}
                          alt={image.alt || ""}
                        />
                      ) : (
                        <Image
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          src={urlFor(image).url()}
                          alt={image.alt || ""}
                          fill
                          placeholder={
                            image?.asset?.metadata?.lqip ? "blur" : undefined
                          }
                          blurDataURL={image.asset?.metadata?.lqip || ""}
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          quality={75}
                        />
                      )}

                      {/* Text Information Overlay */}
                      {(image.title || image.description) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white transition-opacity duration-300">
                          {image.title && (
                            <h3 className="text-lg font-bold line-clamp-1 mb-1 group-hover:text-primary-foreground/90 transition-colors">
                              {image.title}
                            </h3>
                          )}
                          {image.description && (
                            <p className="text-sm text-zinc-200 line-clamp-2">
                              {image.description}
                            </p>
                          )}
                          {image.link?.href && (
                            <span className="mt-2 text-xs font-semibold underline decoration-dotted transition-colors hover:text-zinc-300">
                              Selengkapnya &rarr;
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <CarouselItem
                      key={`${index}-${image.alt}`}
                      className={CAROUSEL_SIZES[cleanSize]}
                    >
                      {image.link?.href ? (
                        <Link
                          href={image.link.href}
                          target={image.link.target ? "_blank" : undefined}
                          rel={image.link.target ? "noopener noreferrer" : undefined}
                          className="block cursor-pointer"
                        >
                          {slideContent}
                        </Link>
                      ) : (
                        slideContent
                      )}
                    </CarouselItem>
                  );
                })
              : null}

            {cleanContentType === "grid" && columns
              ? columns.map((column) => {
                  const Component =
                    gridComponentMap[column._type as keyof typeof gridComponentMap];
                  if (!Component) {
                    console.warn(
                      `No component implemented for grid column type: ${column._type}`,
                    );
                    return null;
                  }
                  return (
                    <CarouselItem
                      key={column._key}
                      className={CAROUSEL_SIZES[cleanSize]}
                    >
                      <Component
                        {...(column as any)}
                        cardTheme={cardTheme}
                        textAlign={cleanTextAlign}
                        cardStyle={cleanCardStyle}
                      />
                    </CarouselItem>
                  );
                })
              : null}
          </CarouselContent>
          <CarouselPrevious
            variant="secondary"
            className="-left-3 md:-left-8 xl:-left-12"
          />
          <CarouselNext
            variant="secondary"
            className="-right-3 md:-right-8 xl:-right-12"
          />
          {cleanIndicators !== "none" && (
            <div className="w-full flex justify-center">
              {cleanIndicators === "dots" && <CarouselDots />}
              {cleanIndicators === "count" && <CarouselCounter />}
            </div>
          )}
        </Carousel>
      )}
    </SectionContainer>
  );
}

