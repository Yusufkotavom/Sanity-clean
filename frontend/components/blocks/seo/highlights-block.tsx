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
      {(eyebrow || title) && (
        <div className="mb-6">
          {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
          {title && <h2 className="mt-1 text-2xl font-bold">{title}</h2>}
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border/40 p-4">
            <p className="text-sm font-medium">{item}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
