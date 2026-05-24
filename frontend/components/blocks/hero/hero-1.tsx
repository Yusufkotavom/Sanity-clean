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
}: Hero1Props) {
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;

  return (
    <SectionShell className="pt-16 lg:pt-24">
      <SectionPanel
        tone="neutral"
        className="grid gap-8 overflow-hidden rounded-[1.75rem] p-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] md:p-7 lg:gap-10 lg:p-8"
      >
        <div className="flex flex-col justify-center">
          {tagLine || uiIcon ? (
            <div className="mb-3 inline-flex items-center gap-2 text-ui-label text-foreground/55">
              <SanityIcon icon={uiIcon} className="size-4" />
              {tagLine ? <span>{tagLine}</span> : null}
            </div>
          ) : null}
          <SectionIntro
            title={resolvedTitle || ""}
            className="mb-0 max-w-3xl"
          />
          {body ? (
            <div className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              <PortableTextRenderer value={body} />
            </div>
          ) : null}
          {links && links.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((link) => (
                <Button key={link.title} variant={link?.buttonVariant} asChild>
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
                className="h-full w-full object-cover"
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
      </SectionPanel>
    </SectionShell>
  );
}
