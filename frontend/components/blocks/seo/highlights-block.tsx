import { Check } from "lucide-react";
import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  items?: string[] | null;
};

export default function HighlightsBlock({ padding, colorVariant, eyebrow, title, description, items }: Props) {
  if (!items?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="mx-auto max-w-5xl">
        {(eyebrow || title) && (
          <div className="mb-8">
            {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
            {title && <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>}
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
              <span className="flex size-6 shrink-0 items-center justify-center  bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <p className="text-sm font-medium text-foreground leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
