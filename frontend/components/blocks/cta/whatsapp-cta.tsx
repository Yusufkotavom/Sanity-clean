import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import { Button } from "@/components/ui/button";
import SanityIcon from "@/components/icons/sanity-icon";
import Eyebrow from "@/components/ui/eyebrow";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import { cn } from "@/lib/utils";
import { SectionPanel, SectionShell } from "@/components/ui/section-shell";

type WhatsAppCtaProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "whatsapp-cta" }
>;

export default async function WhatsAppCta({
  
  sectionWidth = "default",
  stackAlign = "left",
  tagLine,
  uiIcon,
  title,
  body,
  secondaryLink,
}: WhatsAppCtaProps) {
  const isNarrow = sectionWidth === "narrow";
  const isDefault = sectionWidth === "default";

  return (
    <SectionShell>
      <div
        className={cn(
          isNarrow ? "mx-auto max-w-[48rem]" : 
          isDefault ? "mx-auto max-w-4xl" : "w-full",
        )}
      >
        <SectionPanel
          tone={false ? "sky" : "neutral"}
          className={cn(
            "flex flex-col rounded-2xl px-5 py-6 md:px-7 md:py-8 border border-white/60 shadow-sm dark:border-white/10",
            stackAlign === "center" ? "items-center text-center" : undefined,
          )}
        >
          <Eyebrow
            icon={uiIcon}
            title={tagLine}
            variant="subtle"
            className={stackAlign === "center" ? "justify-center" : undefined}
          />
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {body ? (
            <div className="mt-4 text-sm leading-7 text-current/80 md:text-base">
              <PortableTextRenderer value={body} />
            </div>
          ) : null}
          <div
            className={cn(
              "mt-6 flex flex-wrap gap-3",
              stackAlign === "center" ? "justify-center" : undefined,
            )}
          >
            <GlobalWhatsAppButton fallbackLabel="Chat via WhatsApp" />
            {secondaryLink?.title && secondaryLink.href ? (
              <Button variant={secondaryLink?.buttonVariant || "outline"} size="lg" asChild>
                <Link
                  href={secondaryLink.href}
                  target={secondaryLink.target ? "_blank" : undefined}
                  rel={secondaryLink.target ? "noopener noreferrer" : undefined}
                >
                  <SanityIcon
                    icon={secondaryLink.uiIcon || secondaryLink.icon}
                    className="size-4"
                  />
                  {secondaryLink.title}
                </Link>
              </Button>
            ) : null}
          </div>
        </SectionPanel>
      </div>
    </SectionShell>
  );
}
