import { stegaClean } from "next-sanity";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import GlassCard from "@/components/ui/glass-card";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type BenefitsBlock = Extract<Block, { _type: "benefits-block" }>;

export default function BenefitsBlock({
  padding,
  colorVariant,
  title,
  subtitle,
  description,
  benefits,
}: BenefitsBlock) {
  const color = stegaClean(colorVariant);

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

        {benefits && benefits.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <GlassCard key={benefit._key} hover>
                {benefit.icon && (
                  <div className="mb-3 text-4xl">{benefit.icon}</div>
                )}
                <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
                {benefit.badge && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {benefit.badgeIcon && (
                      <span className="text-base">{benefit.badgeIcon}</span>
                    )}
                    <span>{benefit.badge}</span>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
