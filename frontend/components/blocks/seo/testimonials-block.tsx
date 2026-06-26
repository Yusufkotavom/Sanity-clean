import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import { fetchSeoSettings } from "@/sanity/lib/fetch";
import { Star, TrendingUp, CheckCircle } from "lucide-react";
import type { ColorVariant, SectionPadding } from "@/sanity.types";
import GlassCard from "@/components/ui/glass-card";
import StarRating from "@/components/ui/star-rating";

type ManualItem = {
  _key?: string;
  reviewerName?: string;
  reviewerRole?: string;
  rating?: number;
  reviewBody?: string;
};

type TestimonialsBlock = {
  _type: "testimonials-block";
  _key: string;
  padding?: string;
  colorVariant?: string;
  title?: string;
  description?: string;
  source?: string;
  category?: string;
  manualItems?: ManualItem[] | null;
};

export default async function TestimonialsBlock({
  padding,
  colorVariant,
  title,
  description,
  source,
  category,
  manualItems,
}: TestimonialsBlock) {
  const color = stegaClean(colorVariant) as ColorVariant | null;
  const pad = padding as unknown as SectionPadding | null;
  const dataSource = stegaClean(source) || "global";

  let items: any[] = [];

  if (dataSource === "global") {
    const seoSettings = await fetchSeoSettings();
    const allTestimonials = seoSettings?.testimonials || [];
    const cat = stegaClean(category);
    items = cat
      ? allTestimonials.filter((t: any) =>
          t.industry?.toLowerCase().includes(cat.toLowerCase()),
        )
      : allTestimonials;
  } else {
    items = manualItems || [];
  }

  if (!items || items.length === 0) return null;

  const isGlobal = dataSource === "global";

  return (
    <SectionContainer color={color} padding={pad}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title || "Apa Kata Klien Kami"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description || "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any, i: number) => (
            <GlassCard key={item._key || i} hover>
              {isGlobal ? (
                <>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {item.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </div>

                  <blockquote className="text-sm leading-relaxed text-muted-foreground mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  {item.results && (
                    <div className="mb-4 rounded-md bg-primary/5 p-3">
                      <div className="flex items-center gap-2 text-primary">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">{item.results.metric}</span>
                      </div>
                      <div className="mt-1 text-2xl font-bold text-primary">{item.results.value}</div>
                      <div className="text-xs text-muted-foreground">dalam {item.results.timeframe}</div>
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.position} - {item.company}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.industry}</div>
                  </div>
                </>
              ) : (
                <>
                  <StarRating rating={item.rating || 5} size="sm" />
                  {item.reviewBody && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">{item.reviewBody}</p>
                  )}
                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {(item.reviewerName || "R").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.reviewerName}</h4>
                      {item.reviewerRole && <p className="text-xs text-muted-foreground">{item.reviewerRole}</p>}
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
