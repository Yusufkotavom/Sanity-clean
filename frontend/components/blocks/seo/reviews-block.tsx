import SectionContainer from "@/components/ui/section-container";
import StarRating from "@/components/ui/star-rating";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  title?: string | null;
  reviews?: Array<{
    _key?: string;
    reviewerName?: string;
    reviewerRole?: string;
    rating?: number;
    reviewBody?: string;
  }> | null;
};

export default function ReviewsBlock({ padding, colorVariant, title, reviews }: Props) {
  // If no reviews, we can render a fallback if in draft mode, but returning null is safer.
  if (!reviews?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="mx-auto max-w-6xl">
        {title && <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={r._key || i} className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
              <div>
                <StarRating rating={r.rating || 5} size="sm" />
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">{r.reviewBody}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {(r.reviewerName || "R").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{r.reviewerName}</h4>
                  {r.reviewerRole && <p className="text-xs text-muted-foreground">{r.reviewerRole}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
