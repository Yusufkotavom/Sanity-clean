import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SanityIcon from "@/components/icons/sanity-icon";
import type { SanityIconValue } from "@/components/icons/sanity-icon";
import { SectionPanel, SectionShell } from "@/components/ui/section-shell";

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
};
type HeroVercelProps = {
  tagLine?: string | null;
  title?: string | null;
  description?: string | null;
  ctaPrimary?: HeroLink | null;
  ctaSecondary?: HeroLink | null;
  cards?: HeroCard[] | null;
};

export default function HeroVercel({
  tagLine,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  cards,
}: HeroVercelProps) {
  return (
    <SectionShell className="pt-16 lg:pt-24">
      <SectionPanel
        tone="neutral"
        className="overflow-hidden rounded-[2rem] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,248,252,0.84)_100%)] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.78)_0%,rgba(15,23,42,0.62)_100%)] md:p-8 lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div>
            {tagLine ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75 dark:bg-white/10">
                <Sparkles className="size-3.5" />
                <span>{tagLine}</span>
              </div>
            ) : null}

            <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
                {description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {ctaPrimary?.title ? (
                <Button asChild size="lg" className="rounded-full px-6">
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
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
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
            {cards?.map((card) => (
              <article
                key={card._key}
                className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/15 dark:bg-white/5"
              >
                <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-foreground/15 bg-background/80">
                  <SanityIcon icon={card.uiIcon} className="size-4" />
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
                  {card.title}
                </h3>
                {card.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </SectionPanel>
    </SectionShell>
  );
}
