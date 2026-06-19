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
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

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

type Carousel1 = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "carousel-1" }
>;

interface Carousel1Props extends Omit<
  NonNullable<Carousel1>,
  "_type" | "_key"
> {
  size: CarouselSize | null;
  indicators: "none" | "dots" | "count" | null;
  aspectRatio?: string | null;
}

export default function Carousel1({
  padding,
  colorVariant,
  size = "one",
  indicators = "none",
  aspectRatio = "auto",
  images,
}: Carousel1Props) {
  const cleanSize = stegaClean(size) as CarouselSize;
  const cleanIndicators = stegaClean(indicators);
  const cleanAspectRatio = stegaClean(aspectRatio);

  const ratioClass = ASPECT_RATIO_CLASSES[cleanAspectRatio || "auto"] || "";

  return (
    <SectionContainer color={colorVariant} padding={padding}>
      {images && images.length > 0 && (
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={`${index}-${image.alt}`}
                className={CAROUSEL_SIZES[cleanSize]}
              >
                {image && (
                  <div
                    className={cn(
                      "relative mx-auto overflow-hidden rounded-2xl",
                      ratioClass || "h-[30rem] md:h-[25rem] xl:h-[30rem]",
                      cleanSize === "one" ? "max-w-[35rem]" : undefined,
                    )}
                  >
                    <Image
                      className="object-cover"
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
                  </div>
                )}
              </CarouselItem>
            ))}
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
