import SectionContainer from "@/components/ui/section-container";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  items?: Array<{ _key?: string; value?: string; label?: string; brand?: string }> | null;
};

export default function MetricsRailBlock({ padding, colorVariant, items }: Props) {
  if (!items?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, i) => (
          <div key={item._key || i} className="rounded-xl border border-border/40 p-5">
            <p className="text-3xl font-bold">{item.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            {item.brand && <span className="mt-2 inline-block rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{item.brand}</span>}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
