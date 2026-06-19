import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SanityIcon from "@/components/icons/sanity-icon";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import { SectionPanel, SectionShell } from "@/components/ui/section-shell";
import SectionContainer from "@/components/ui/section-container";

type Cta1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "cta-1" }
>;

export default function Cta1({
  colorVariant,
  backgroundWidth = "compact",
  useCard = true,
  sectionWidth = "default",
  stackAlign = "left",
  tagLine,
  uiIcon,
  title,
  body,
  links,
  image,
  imagePosition = "top",
  padding,
}: Cta1Props) {
  const isNarrow = sectionWidth === "narrow";
  const isDefault = sectionWidth === "default";
  const alignClasses = stackAlign === "center" ? "items-center text-center" : "";
  const tone = colorVariant === "primary" ? "sky" : "neutral";

  const contentNode = (
    <div className={cn("flex flex-col flex-1", alignClasses)}>
      {tagLine || uiIcon ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 text-ui-label text-current/70",
            stackAlign === "center" ? "justify-center" : undefined,
          )}
        >
          <SanityIcon icon={uiIcon} className="size-4" />
          {tagLine ? <span>{tagLine}</span> : null}
        </div>
      ) : null}
      
      {title ? (
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
      ) : null}
      
      {body ? (
        <div className="mt-4 text-sm leading-7 text-current/80 md:text-base prose prose-neutral dark:prose-invert">
          <PortableTextRenderer value={body} />
        </div>
      ) : null}
      
      {links && links.length > 0 && (
        <div
          className={cn(
            "mt-6 flex flex-wrap gap-3",
            stackAlign === "center" ? "justify-center" : undefined,
          )}
        >
          {links.map((link, index) => (
            <Button key={link._key || link.title} variant={index === 0 ? "default" : "outline"} size="lg" className="rounded-full px-6 transition-all duration-200 active:scale-[0.98]" asChild>
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
      )}
    </div>
  );

  const imageNode = image?.asset ? (
    <div className="relative overflow-hidden rounded-2xl w-full h-auto aspect-video md:aspect-[4/3] lg:aspect-video flex-1 shadow-lg">
      <Image
        src={image.asset.url || ""}
        alt={(image as any).alt || "CTA Image"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={image.asset.metadata?.lqip || undefined}
      />
    </div>
  ) : null;

  let layoutNode = contentNode;
  if (imageNode) {
    if (imagePosition === "left") {
      layoutNode = (
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          {imageNode}
          {contentNode}
        </div>
      );
    } else {
      // Top image
      layoutNode = (
        <div className="flex flex-col gap-6 w-full">
          {imageNode}
          {contentNode}
        </div>
      );
    }
  }

  // Determine wrapper based on useCard
  const innerWrapper = useCard ? (
    <SectionPanel
      tone={tone}
      className={cn(
        "rounded-2xl border border-white/60 shadow-sm dark:border-white/10 px-5 py-6 md:px-7 md:py-8 w-full",
        !imageNode ? alignClasses : ""
      )}
    >
      {layoutNode}
    </SectionPanel>
  ) : (
    <div className={cn("w-full py-6 md:py-8", !imageNode ? alignClasses : "")}>
      {layoutNode}
    </div>
  );

  const containerClasses = cn(
    isNarrow ? "mx-auto max-w-[48rem]" : 
    isDefault ? "mx-auto max-w-4xl" : "w-full"
  );

  // If full width background is desired, we use SectionContainer to wrap the whole thing
  // but if useCard is false, SectionContainer will apply the color natively.
  // If useCard is true and full width, the card gets tone, while container gets background?
  // Wait, if it's a card, the card has its own background color via tone. The full-width background would need its own colorVariant.
  // To keep it simple: If full width, use SectionContainer. If compact, use SectionShell.
  
  if (backgroundWidth === "full") {
    return (
      <SectionContainer color={colorVariant} padding={padding}>
        <div className={containerClasses}>
          {innerWrapper}
        </div>
      </SectionContainer>
    );
  }

  // Compact width
  return (
    <SectionShell divider={false}>
      <div className={containerClasses}>
        {innerWrapper}
      </div>
    </SectionShell>
  );
}
