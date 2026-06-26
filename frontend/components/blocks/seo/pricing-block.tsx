import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import { fetchSeoSettings } from "@/sanity/lib/fetch";
import { Check, X, Clock, CreditCard } from "lucide-react";
import WhatsAppLink from "@/components/whatsapp-link";
import { ColorVariant, SectionPadding } from "@/sanity.types";
import GlassCard from "@/components/ui/glass-card";

type PricingBlock = {
  _type: "pricing-block";
  _key: string;
  padding?: string;
  colorVariant?: string;
  title?: string;
  description?: string;
  category: "website" | "software" | "printing";
};

function formatPrice(price: number, currency: string = "IDR", priceUnit?: string) {
  if (priceUnit) {
    return `Rp ${price.toLocaleString("id-ID")} ${priceUnit}`;
  }
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default async function PricingBlock({
  padding,
  colorVariant,
  title,
  description,
  category,
}: PricingBlock) {
  const color = stegaClean(colorVariant) as ColorVariant | null;
  const pad = padding as unknown as SectionPadding | null;
  const seoSettings = await fetchSeoSettings();
  const packages = seoSettings?.pricingPackages?.[category] || [];

  if (!packages || packages.length === 0) return null;

  return (
    <SectionContainer color={color} padding={pad}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title || "Paket Harga"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description || "Pilih paket yang sesuai dengan kebutuhan bisnis Anda"}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg: any) => (
            <GlassCard key={pkg._key} hover className="flex flex-col">
              {/* Package Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {formatPrice(pkg.price, pkg.currency, pkg.priceUnit)}
                  </span>
                </div>
                {pkg.bestFor && (
                  <div className="mt-2 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                    {pkg.bestFor}
                  </div>
                )}
              </div>

              {/* Duration & Payment */}
              <div className="mb-6 space-y-2 text-sm">
                {pkg.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                )}
                {pkg.paymentTerms && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4 mt-0.5" />
                    <span className="text-xs">{pkg.paymentTerms}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-3 text-sm">Yang Anda Dapatkan:</h4>
                <ul className="space-y-2">
                  {pkg.features?.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              {pkg.excluded && pkg.excluded.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm">Tidak Termasuk:</h4>
                  <ul className="space-y-2">
                    {pkg.excluded.map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto">
                <WhatsAppLink
                  phoneNumber="6285799520350"
                  predefinedText={`Halo, saya tertarik dengan paket ${pkg.name}`}
                  trackingContext="seo_pricing_block"
                  ariaLabel={`Konsultasi Gratis paket ${pkg.name}`}
                  className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Konsultasi Gratis
                </WhatsAppLink>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
