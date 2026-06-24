import SectionContainer from "@/components/ui/section-container";
import { Zap, ShieldCheck, BadgeCheck, Truck, Sparkles } from "lucide-react";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

const ICONS = [Zap, ShieldCheck, BadgeCheck, Truck, Sparkles] as const;

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  badges?: Array<{ _key?: string; label?: string; description?: string }> | null;
};

export default function MicroBadgesBlock({ padding, colorVariant, badges }: Props) {
  if (!badges?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {badges.map((badge, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={badge._key || i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{badge.label}</h3>
                {badge.description && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{badge.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
