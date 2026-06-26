import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SanityIcon from "@/components/icons/sanity-icon";
import { urlFor } from "@/sanity/lib/image";
import type { SanityIconValue } from "@/components/icons/sanity-icon";
import { SectionPanel, SectionShell } from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";

type HeroLink = {
  title?: string | null;
  href?: string | null;
  target?: boolean | null;
};
type HeroCard = {
  _key?: string;
  uiIcon?: SanityIconValue;
  title?: string | null;
  description?: string | null;
  link?: HeroLink | null;
};
type HeroVercelProps = {
  tagLine?: string | null;
  title?: string | null;
  description?: string | null;
  ctaPrimary?: HeroLink | null;
  ctaSecondary?: HeroLink | null;
  cards?: HeroCard[] | null;
  image?: { asset?: { _ref?: string } | null; alt?: string | null } | null;
  useCard?: boolean;
  colorVariant?: string | null;
};

export default function HeroVercel({
  tagLine,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  cards,
  image,
  useCard = true,
  colorVariant = "transparent",
}: HeroVercelProps) {
  const imageUrl = image && (image.asset || !!(image as any)._url) ? urlFor(image).width(1200).quality(80).auto("format").url() : null;
  const isTransparent = colorVariant === "transparent";
  const tone = colorVariant === "primary" ? "sky" : (isTransparent ? undefined : "neutral");

  const innerContent = (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start w-full">
        <div>
          {tagLine ? (
            <div className="mb-4 inline-flex items-center gap-2  border border-foreground/15 bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75 dark:bg-white/10">
              <Sparkles className="size-3.5" />
              <span>{tagLine}</span>
            </div>
          ) : null}

          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctaPrimary?.title ? (
              <Button asChild size="lg" variant="default" className="transition-all duration-200 active:scale-[0.98]">
                <Link
                  href={ctaPrimary.href || "#"}
                  target={ctaPrimary.target ? "_blank" : undefined}
                  rel={ctaPrimary.target ? "noopener" : undefined}
                >
                  {ctaPrimary.title}
                </Link>
              </Button>
            ) : null}

            {ctaSecondary?.title ? (
              <Button asChild size="lg" variant="outline" className="transition-all duration-200 active:scale-[0.98]">
                <Link
                  href={ctaSecondary.href || "#"}
                  target={ctaSecondary.target ? "_blank" : undefined}
                  rel={ctaSecondary.target ? "noopener" : undefined}
                >
                  {ctaSecondary.title}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {cards?.map((card) => {
            const inner = (
              <article className="h-full rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 hover:shadow-lg dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-foreground/15 bg-background/80 transition-colors group-hover:border-foreground/30">
                  <SanityIcon icon={card.uiIcon} className="size-4" fallbackSeed={card.title || card._key || "card"} />
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
                  {card.title}
                </h3>
                {card.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.description}</p>
                ) : null}
              </article>
            );

            return card.link?.href ? (
              <Link
                key={card._key}
                href={card.link.href}
                target={card.link.target ? "_blank" : undefined}
                rel={card.link.target ? "noopener noreferrer" : undefined}
                className="group block h-full rounded-2xl outline-none ring-ring/10 focus-visible:outline-1 focus-visible:ring-4"
              >
                {inner}
              </Link>
            ) : (
              <div key={card._key} className="group h-full">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
      {imageUrl ? (
        <div className="mt-8 overflow-hidden rounded-xl lg:col-span-2 w-full">
          <Image
            src={imageUrl}
            alt={image?.alt || title || ""}
            width={1200}
            height={630}
            className="h-auto w-full shadow-lg"
            priority
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      ) : null}
    </>
  );

  let layoutNode = null;
  if (useCard) {
    // If it's the default background, we keep the special Vercel gradient
    // If they picked transparent or something else, we let it be.
    const isVercelDefaultCard = colorVariant === "background" || !colorVariant;
    layoutNode = (
      <SectionPanel
        tone={tone as any}
        className={cn(
          "w-full rounded-[2rem] p-6 md:p-8 lg:p-10",
          isVercelDefaultCard
            ? "border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,248,252,0.84)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.78)_0%,rgba(15,23,42,0.62)_100%)]"
            : (isTransparent ? "" : "border border-white/60 bg-white/75 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5")
        )}
      >
        {innerContent}
      </SectionPanel>
    );
  } else {
    layoutNode = (
      <div className="w-full py-8 md:py-12">
        {innerContent}
      </div>
    );
  }

  if (!useCard && colorVariant && colorVariant !== "transparent") {
    return (
      <SectionContainer color={colorVariant as any}>
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
