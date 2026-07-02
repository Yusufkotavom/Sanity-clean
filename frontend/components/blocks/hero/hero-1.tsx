import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import Eyebrow from "@/components/ui/eyebrow";
import {  PAGE_QUERY_RESULT } from "@/sanity.types";
import {
  SectionIntro,
  SectionPanel,
  SectionShell,
} from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";
import { CardShell } from "@/components/ui/card-shell";
import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import { colorToStyle, colorToCardStyle, ColorValue } from "@/lib/gradient";

type Hero1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "hero-1" }
> & {
  pageTitle?: string | null;
  imagePosition?: string | null;
};

export default function Hero1({ blockStyles, 
      tagLine,
      uiIcon,
      title,
      body,
      image,
      links,
      pageTitle,
      useCard = true,
      
      imagePosition = "right",
      
      
    }: Hero1Props) {
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;
  const pos = stegaClean(imagePosition) || "right";

  const textContent = (
    <div className="flex flex-col justify-center">
      <Eyebrow icon={uiIcon} title={tagLine} variant="default" className="self-start" />
      <SectionIntro
        title={resolvedTitle || ""}
        className="mb-0 max-w-3xl"
      />
      {body ? (
        <div className="mt-5 max-w-2xl text-sm leading-7 text-current/80 md:text-base prose prose-neutral dark:prose-invert">
          <PortableTextRenderer value={body} />
        </div>
      ) : null}
      {links && links.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {links.map((link, index) => (
            <Button key={link._key || link.title} variant={link.buttonVariant || (index === 0 ? "default" : "outline")} asChild size="lg" className="transition-all duration-200 active:scale-[0.98]">
              <Link
                href={link.href || "#"}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}
              >
                {(link.uiIcon || link.icon) && (
                  <SanityIcon icon={link.uiIcon || link.icon} className="size-4" />
                )}
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );

  const imageContent = image && (image.asset || !!(image as any)._url) ? (
    <div className="flex flex-col justify-center">
      <CardShell className="overflow-hidden rounded-[1.5rem] p-0 shadow-[0_18px_48px_rgba(15,23,42,0.1)]">
        <Image
          className="h-full w-full object-cover aspect-video md:aspect-auto"
          src={urlFor(image).width(900).url()}
          alt={image.alt || ""}
          width={image.asset?.metadata?.dimensions?.width || 800}
          height={image.asset?.metadata?.dimensions?.height || 800}
          placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ""}
          quality={85}
          priority
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </CardShell>
    </div>
  ) : null;

  const containerLayout = cn(
    "grid gap-8 lg:gap-10 items-center",
    pos === "left"
      ? "md:grid-cols-[minmax(320px,0.92fr)_minmax(0,1fr)]"
      : "md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]",
  );

  const isLeft = pos === "left";
  
  
  

  const innerContent = pos === "left" ? (
    <>{imageContent}{textContent}</>
  ) : (
    <>{textContent}{imageContent}</>
  );

  let layoutNode = null;
  if (useCard) {
    layoutNode = (
      <CardShell
        className={cn(containerLayout, "p-5 md:p-7 lg:p-8")}
        >
        {innerContent}
      </CardShell>
    );
  } else {
    layoutNode = (
      <div className={cn(containerLayout, "py-8 md:py-12 w-full")}>
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
