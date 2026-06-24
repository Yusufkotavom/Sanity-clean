import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import StarRating from "@/components/ui/star-rating";
import type { AffiliateItemData } from "@/lib/seo-jsonld";

const TYPE_LABELS: Record<string, string> = {
  product: "Produk",
  software: "Software",
  service: "Layanan",
  webapp: "Web App",
  mobileapp: "Mobile App",
};

export default function AffiliateProductCard({
  item,
}: {
  item: AffiliateItemData;
}) {
  const imageUrl = (item.image?.asset?._id || item.image?._url)
    ? urlFor(item.image).width(400).height(300).url()
    : null;

  return (
    <div
      className="overflow-hidden rounded-xl border border-border/50 bg-card transition-shadow hover:shadow-lg"
      id={item._key ? `affiliate-${item._key}` : undefined}
    >
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={item.image?.alt || item.name || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {item.position && (
            <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow">
              #{item.position}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            {item.brand && (
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                {item.brand}
              </span>
            )}
            <h3 className="text-lg font-bold leading-tight">
              {item.position && !imageUrl ? `#${item.position} ` : ""}
              {item.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/60">
            {TYPE_LABELS[item.itemType || "product"] || item.itemType}
          </span>
        </div>

        {typeof item.rating === "number" && (
          <StarRating rating={item.rating} size="sm" className="mb-2" />
        )}

        {item.description && (
          <p className="mb-3 text-sm text-foreground/70">{item.description}</p>
        )}

        {/* Pros & Cons */}
        {((item.pros?.length ?? 0) > 0 || (item.cons?.length ?? 0) > 0) && (
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            {(item.pros?.length ?? 0) > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  ✓ Kelebihan
                </p>
                <ul className="space-y-0.5 text-xs text-foreground/70">
                  {item.pros?.map((pro, idx) => (
                    <li key={idx}>+ {pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {(item.cons?.length ?? 0) > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  ✗ Kekurangan
                </p>
                <ul className="space-y-0.5 text-xs text-foreground/70">
                  {item.cons?.map((con, idx) => (
                    <li key={idx}>− {con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {item.verdict && (
          <p className="mb-3 rounded-lg bg-muted/60 p-3 text-sm italic">
            &ldquo;{item.verdict}&rdquo;
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          {typeof item.price === "number" && (
            <span className="text-lg font-bold">
              {item.currency || "IDR"}{" "}
              {item.price.toLocaleString("id-ID")}
            </span>
          )}
          {item.affiliateUrl && (
            <a
              href={item.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {item.affiliateLabel || "Lihat Detail"}
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
