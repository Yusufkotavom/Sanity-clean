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
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          {eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
          <blockquote className="text-2xl font-medium leading-relaxed md:text-3xl">"{quote}"</blockquote>
          <footer className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{author}</span>
            {role && <span> · {role}</span>}
          </footer>
        </div>
        {highlights?.length ? (
          <div className="flex flex-col gap-2">
            {highlights.map((h, i) => (
              <div key={i} className="rounded-xl border border-border/40 px-4 py-3 text-sm">{h}</div>
            ))}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
