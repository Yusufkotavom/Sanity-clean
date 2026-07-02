import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import Eyebrow from "@/components/ui/eyebrow";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import {
  SectionIntro,
  SectionPanel,
  SectionShell,
} from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";
import { CardShell } from "@/components/ui/card-shell";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type HeroImage = {
  _key?: string;
  title?: string | null;
  description?: string | null;
  image?: any;
  link?: { href?: string | null; title?: string | null; target?: boolean | null } | null;
};

type Hero2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "hero-2" }
> & {
  pageTitle?: string | null;
  images?: HeroImage[] | null;
};

function HeroImageCard({ item }: { item: HeroImage }) {
  const imgUrl = item.image && (item.image.asset || !!(item.image as any)._url)
    ? urlFor(item.image).width(900).quality(80).url()
    : null;

  if (!imgUrl) return null;

  const card = (
    <CardShell className="group relative overflow-hidden rounded-xl p-0 transition-all duration-300 hover:scale-[1.02] hover:border-primary/35">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imgUrl}
          alt={item.image?.alt || item.title || ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 600px"
          quality={80}
        />
      </div>
      {(item.title || item.description) && (
        <div className="p-4">
          {item.title && (
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          )}
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          )}
        </div>
      )}
    </CardShell>
  );

  if (item.link?.href) {
    return (
      <Link
        href={item.link.href}
        target={item.link.target ? "_blank" : undefined}
        rel={item.link.target ? "noopener" : undefined}
        className="block"
      >
        {card}
      </Link>
    );
  }

  return card;
}

export default function Hero2({ blockStyles, 
      tagLine,
      uiIcon,
      title,
      body,
      links,
      images,
      pageTitle,
      useCard = true,
      
      
      
    }: Hero2Props) {
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;

  const innerContent = (
    <div className="flex flex-col items-center w-full">
      <Eyebrow icon={uiIcon} title={tagLine} variant="default" className="justify-center" />
      <SectionIntro
        title={resolvedTitle || ""}
        align="center"
        className="mb-0 max-w-3xl"
      />
      {body ? (
        <div className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-current/80 md:text-base prose prose-neutral dark:prose-invert">
          <PortableTextRenderer value={body} />
        </div>
      ) : null}
      {links && links.length > 0 ? (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((link, index) => (
            <Button key={link._key || link.title} variant={link.buttonVariant || (index === 0 ? "default" : "outline")} asChild size="lg" className="transition-all duration-200 active:scale-[0.98]">
              <Link
                href={link.href || "#"}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}
              >
                <SanityIcon icon={link.uiIcon || link.icon} className="size-4" />
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      ) : null}

      {images && images.length > 0 && (
        <div className="mt-8 w-full max-w-5xl mx-auto">
          {images.length === 1 ? (
            <div className="max-w-lg mx-auto">
              <HeroImageCard item={images[0]} />
            </div>
          ) : (
            <Carousel>
              <CarouselContent>
                {images.map((item) => (
                  <CarouselItem key={item._key} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <HeroImageCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant="secondary" className="-left-3 md:-left-8" />
              <CarouselNext variant="secondary" className="-right-3 md:-right-8" />
            </Carousel>
          )}
        </div>
      )}
    </div>
  );

    
  let layoutNode = null;
  if (useCard) {
    layoutNode = (
      <CardShell
        className="rounded-[1.75rem] px-5 py-10 text-center md:px-10 md:py-14 w-full"
        >
        {innerContent}
      </CardShell>
    );
  } else {
    layoutNode = (
      <div className="py-8 md:py-12 w-full flex flex-col items-center">
        {innerContent}
      </div>
    );
  }

  return (
    <SectionContainer blockStyles={blockStyles}>
      
        {layoutNode}
      
    </SectionContainer>
  );
}
