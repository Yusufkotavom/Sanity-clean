import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import {
  SectionIntro,
  SectionPanel,
  SectionShell,
} from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";

type Hero2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "hero-2" }
> & {
  pageTitle?: string | null;
};

export default function Hero2({
  tagLine,
  uiIcon,
  title,
  body,
  links,
  image,
  pageTitle,
  useCard = true,
  colorVariant = "transparent",
}: Hero2Props) {
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;
  const imageUrl = image?.asset ? urlFor(image).width(1200).quality(80).auto("format").url() : null;

  const innerContent = (
    <div className="flex flex-col items-center w-full">
      {tagLine || uiIcon ? (
        <div className="mb-3 inline-flex items-center justify-center gap-2 text-ui-label text-current/55">
          <SanityIcon icon={uiIcon} className="size-4" />
          {tagLine ? <span>{tagLine}</span> : null}
        </div>
      ) : null}
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
      {imageUrl ? (
        <div className="mt-8 overflow-hidden rounded-xl w-full">
          <Image
            src={imageUrl}
            alt={image?.alt || resolvedTitle || ""}
            width={1200}
            height={630}
            className="h-auto w-full object-cover shadow-lg"
            priority
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      ) : null}
    </div>
  );

  let layoutNode = null;
  if (useCard) {
    const tone = colorVariant === "primary" ? "sky" : (colorVariant === "transparent" ? undefined : "neutral");
    layoutNode = (
      <SectionPanel
        tone={tone as any}
        className="rounded-[1.75rem] px-5 py-10 text-center md:px-10 md:py-14 w-full"
      >
        {innerContent}
      </SectionPanel>
    );
  } else {
    layoutNode = (
      <div className="py-8 md:py-12 text-center w-full">
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
