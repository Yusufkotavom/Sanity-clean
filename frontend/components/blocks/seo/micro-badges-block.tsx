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
            <div key={badge._key || i} className="flex items-start gap-3 rounded-xl border border-border/40 p-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-semibold">{badge.label}</h3>
                {badge.description && <p className="mt-0.5 text-xs text-muted-foreground">{badge.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
