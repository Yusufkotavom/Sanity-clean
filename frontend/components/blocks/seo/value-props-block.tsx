import { cleanString as stegaClean } from "@/lib/clean";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import GlassCard from "@/components/ui/glass-card";
import { Compass, Gauge, ShieldCheck, Sparkles } from "lucide-react";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type ValuePropsBlock = Extract<Block, { _type: "value-props-block" }>;

export default function ValuePropsBlock({
  padding,
  colorVariant,
  title,
  description,
  valueProps,
}: ValuePropsBlock) {
  const color = stegaClean(colorVariant);
  const iconMap = [Compass, Gauge, ShieldCheck, Sparkles];

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <h2 className="mb-3 text-center text-3xl font-bold md:text-4xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
            {description}
          </p>
        )}

        {valueProps && valueProps.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop, idx) => (
              <GlassCard key={prop._key} hover className="text-center">
                <div className="mb-4 flex justify-center">
                  {(() => {
                    const Icon = iconMap[idx % iconMap.length];
                    return (
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                    );
                  })()}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{prop.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {prop.description}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
