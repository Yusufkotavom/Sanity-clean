import { Quote } from "lucide-react";
import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  eyebrow?: string | null;
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  highlights?: string[] | null;
};

export default function QuoteSpotlightBlock({ padding, colorVariant, eyebrow, quote, author, role, highlights }: Props) {
  if (!quote) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-16">
          <div className="relative">
            <Quote className="absolute -left-4 -top-6 size-16 rotate-180 text-primary/10 md:-left-8 md:-top-8 md:size-24" />
            <div className="relative z-10">
              {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
              <blockquote className="text-2xl font-medium leading-relaxed md:text-3xl lg:text-4xl lg:leading-tight">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 text-sm">
                <div className="h-px w-8 bg-primary/30"></div>
                <div>
                  <span className="font-semibold text-foreground">{author}</span>
                  {role && <span className="text-muted-foreground"> · {role}</span>}
                </div>
              </footer>
            </div>
          </div>
          
          {highlights?.length ? (
            <div className="flex flex-col gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center rounded-xl border border-border/40 bg-card px-5 py-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
                  <span className="text-sm font-medium text-foreground">{h}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  );
}
