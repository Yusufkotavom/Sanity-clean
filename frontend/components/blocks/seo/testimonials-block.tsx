import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import { fetchSeoSettings } from "@/sanity/lib/fetch";
import { Star, TrendingUp, CheckCircle } from "lucide-react";
import { ColorVariant, SectionPadding } from "@/sanity.types";
import GlassCard from "@/components/ui/glass-card";

type TestimonialsBlock = {
  _type: "testimonials-block";
  _key: string;
  padding?: string;
  colorVariant?: string;
  title?: string;
  description?: string;
  category?: string;
};

export default async function TestimonialsBlock({
  padding,
  colorVariant,
  title,
  description,
  category,
}: TestimonialsBlock) {
  const color = stegaClean(colorVariant) as ColorVariant | null;
  const pad = padding as unknown as SectionPadding | null;
  const seoSettings = await fetchSeoSettings();
  const allTestimonials = seoSettings?.testimonials || [];

  // Filter by category if specified
  const testimonials = category
    ? allTestimonials.filter((t: any) => 
        t.industry?.toLowerCase().includes(category.toLowerCase())
      )
    : allTestimonials;

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <SectionContainer color={color} padding={pad}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title || "Apa Kata Klien Kami"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description || "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom"}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial: any) => (
            <GlassCard key={testimonial._key} hover>
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {testimonial.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                )}
              </div>

              {/* Quote */}
              <blockquote className="text-sm leading-relaxed text-muted-foreground mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Results */}
              {testimonial.results && (
                <div className="mb-4 rounded-md bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {testimonial.results.metric}
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-bold text-primary">
                    {testimonial.results.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    dalam {testimonial.results.timeframe}
                  </div>
                </div>
              )}

              {/* Author */}
              <div className="border-t border-border/60 pt-4">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.position} - {testimonial.company}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {testimonial.industry}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
