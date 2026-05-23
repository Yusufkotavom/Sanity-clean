import { stegaClean } from "@/lib/clean";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import GlassCard from "@/components/ui/glass-card";
import { FlaskConical, Hammer, Rocket, Layers3 } from "lucide-react";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type FeaturesPackageBlock = Extract<Block, { _type: "features-package-block" }>;

export default function FeaturesPackageBlock({
  padding,
  colorVariant,
  title,
  subtitle,
  description,
  features,
}: FeaturesPackageBlock) {
  const color = stegaClean(colorVariant);
  const iconMap = [FlaskConical, Hammer, Rocket, Layers3];

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <div className="mb-4 text-center text-3xl font-bold md:text-4xl">
            {title}
          </div>
        )}
        {subtitle && (
          <div className="mb-3 text-center text-xl font-semibold md:text-2xl">
            {subtitle}
          </div>
        )}
        {description && (
          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
            {description}
          </p>
        )}

        {features && features.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <GlassCard key={feature._key} hover>
                <div className="mb-4 flex items-center gap-3">
                  {(() => {
                    const Icon = iconMap[idx % iconMap.length];
                    return (
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                    );
                  })()}
                  {feature.badge && (
                    <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-medium">
                      {feature.badge}
                    </div>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
