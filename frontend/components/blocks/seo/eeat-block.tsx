import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  points?: Array<{ _key?: string; title?: string; description?: string }> | null;
};

export default function EeatBlock({ padding, colorVariant, eyebrow, title, description, points }: Props) {
  if (!points?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="mb-6">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
        {title && <h2 className="mt-1 text-2xl font-bold">{title}</h2>}
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {points.map((p, i) => (
          <div key={p._key || i} className="rounded-xl border border-border/40 p-4">
            <h3 className="text-sm font-semibold">{p.title}</h3>
            {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
