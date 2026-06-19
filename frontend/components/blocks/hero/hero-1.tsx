import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import {
  SectionIntro,
  SectionPanel,
  SectionShell,
} from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";

type Hero1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "hero-1" }
> & {
  pageTitle?: string | null;
};

export default function Hero1({
  tagLine,
  uiIcon,
  title,
  body,
  image,
  links,
  pageTitle,
  useCard = true,
  colorVariant = "transparent",
}: Hero1Props) {
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;

  const innerContent = (
    <>
      <div className="flex flex-col justify-center">
        {tagLine || uiIcon ? (
          <div className="mb-3 inline-flex items-center gap-2 text-ui-label text-current/55">
            <SanityIcon icon={uiIcon} className="size-4" />
            {tagLine ? <span>{tagLine}</span> : null}
          </div>
        ) : null}
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
              <Button key={link._key || link.title} variant={index === 0 ? "default" : "outline"} asChild size="lg" className="rounded-full px-6 transition-all duration-200 active:scale-[0.98]">
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
      </div>
      <div className="flex flex-col justify-center">
        {image && image.asset?._id && (
          <div className="overflow-hidden rounded-[1.5rem] border border-white/45 bg-white/70 shadow-[0_18px_48px_rgba(15,23,42,0.1)] dark:border-white/12 dark:bg-white/5">
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
          </div>
        )}
      </div>
    </>
  );

  const containerLayout = "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] lg:gap-10 items-center";

  let layoutNode = null;
  if (useCard) {
    const tone = colorVariant === "primary" ? "sky" : (colorVariant === "transparent" ? undefined : "neutral");
    layoutNode = (
      <SectionPanel
        tone={tone as any}
        className={cn(containerLayout, "overflow-hidden rounded-[1.75rem] p-5 md:p-7 lg:p-8")}
      >
        {innerContent}
      </SectionPanel>
    );
  } else {
    layoutNode = (
      <div className={cn(containerLayout, "py-8 md:py-12 w-full")}>
        {innerContent}
      </div>
    );
  }

  if (!useCard && colorVariant && colorVariant !== "transparent") {
    return (
      <SectionContainer color={colorVariant}>
        {layoutNode}
      </SectionContainer>
    );
  }

  return (
    <SectionShell className="pt-16 lg:pt-24">
      {layoutNode}
    </SectionShell>
  );
}
