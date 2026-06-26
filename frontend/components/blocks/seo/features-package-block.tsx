import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Feature = { _key?: string; icon?: string; title?: string; description?: string; badge?: string };
type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  cardStyle?: "grid" | "list" | "numbered" | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  features?: Feature[] | null;
  cta?: { title?: string; href?: string; buttonVariant?: string } | null;
};

export default function FeaturesPackageBlock({
  padding,
  colorVariant,
  cardStyle,
  title,
  subtitle,
  description,
  features,
  cta,
}: Props) {
  const color = stegaClean(colorVariant);
  const style = cardStyle || "grid";

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="mx-auto max-w-5xl">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>}
            {subtitle && <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>}
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </div>
        )}

        {features && features.length > 0 && (
          <div className={cn(
            style === "grid" && "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
            style === "list" && "space-y-4",
            style === "numbered" && "space-y-4",
          )}>
            {features.map((f, i) => (
              <div
                key={f._key || i}
                className={cn(
                  "transition-all duration-300",
                  style === "grid" && "flex flex-col rounded-xl border border-border/40 bg-card p-6 shadow-sm hover:border-primary/20 hover:shadow-md",
                  style === "list" && "flex items-start gap-4 rounded-xl border border-border/40 bg-card p-5 shadow-sm hover:border-primary/20 hover:shadow-md",
                  style === "numbered" && "flex items-start gap-4 rounded-xl border border-border/40 bg-card p-5 shadow-sm hover:border-primary/20 hover:shadow-md",
                )}
              >
                {style === "numbered" && (
                  <span className="flex size-8 shrink-0 items-center justify-center  bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                )}
                {style !== "numbered" && f.icon && (
                  <span className={cn(
                    "flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                    style === "grid" ? "mb-4 size-10 text-lg" : "size-10 text-lg"
                  )}>{f.icon}</span>
                )}
                <div className="flex-1">
                  <h3 className={cn("font-semibold text-foreground", style === "grid" ? "text-base" : "text-sm")}>
                    {f.title}
                    {f.badge && <span className="ml-2 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary shadow-sm">{f.badge}</span>}
                  </h3>
                  {f.description && <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {cta?.title && cta?.href && (
          <div className="mt-8">
            <Button asChild variant="default" size="lg" className=" px-6">
              <Link href={cta.href}>{cta.title}</Link>
            </Button>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
