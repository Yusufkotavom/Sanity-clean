import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import StarRating from "@/components/ui/star-rating";

interface ReviewCardProps {
  reviewerName: string;
  reviewerRole?: string;
  reviewerImage?: any;
  rating: number;
  reviewBody?: string;
  datePublished?: string;
  source?: string;
  sourceUrl?: string;
  verified?: boolean;
}

const SOURCE_LABELS: Record<string, string> = {
  "google-maps": "Google Maps",
  tokopedia: "Tokopedia",
  shopee: "Shopee",
  internal: "Verified Customer",
  other: "External Review",
};

export default function ReviewCard({
  reviewerName,
  reviewerRole,
  reviewerImage,
  rating,
  reviewBody,
  datePublished,
  source,
  sourceUrl,
  verified,
}: ReviewCardProps) {
  const imageUrl = (reviewerImage?.asset?._id || reviewerImage?._url)
    ? urlFor(reviewerImage).width(80).height(80).url()
    : null;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start gap-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={reviewerName}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {reviewerName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{reviewerName}</p>
          {reviewerRole && (
            <p className="text-sm text-foreground/60">{reviewerRole}</p>
          )}
        </div>
      </div>
      <StarRating rating={rating} size="sm" showValue={false} className="mb-2" />
      {reviewBody && (
        <p className="text-sm leading-relaxed text-foreground/80">{reviewBody}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground/50">
        {datePublished && (
          <time dateTime={datePublished}>
            {new Date(datePublished).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        {source && (
          <span className="rounded-full bg-muted px-2 py-0.5">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {SOURCE_LABELS[source] || source}
              </a>
            ) : (
              SOURCE_LABELS[source] || source
            )}
          </span>
        )}
        {verified && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            ✓ Verified
          </span>
        )}
      </div>
    </div>
  );
}
