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
  if (!reviews?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <div key={r._key || i} className="rounded-xl border border-border/40 p-4">
            <StarRating rating={r.rating || 5} size="sm" />
            <p className="mt-2 text-sm text-muted-foreground">{r.reviewBody}</p>
            <div className="mt-3 text-xs">
              <span className="font-semibold">{r.reviewerName}</span>
              {r.reviewerRole && <span className="text-muted-foreground"> · {r.reviewerRole}</span>}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
