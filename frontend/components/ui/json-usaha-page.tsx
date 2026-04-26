import Link from "next/link";
import { Building2, CheckCircle2, MapPin, Phone, Quote, Sparkles } from "lucide-react";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import JsonLd from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import type { JsonUsahaPage } from "@/lib/local-content/json-usaha";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from "@/lib/seo-jsonld";
import { fetchSanitySeoSettings } from "@/sanity/lib/fetch";

type JsonUsahaPageProps = {
  page: JsonUsahaPage;
  basePath?: string;
  breadcrumbLabel?: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-ui-label text-primary/80">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base text-foreground/72 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export default async function JsonUsahaPageView({
  page,
  basePath = "/services",
  breadcrumbLabel = "Layanan",
}: JsonUsahaPageProps) {
  const seo = await fetchSanitySeoSettings();
  const siteUrl = (seo as any)?.siteUrl;
  const resolvedPath = `${basePath}/${page.slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: breadcrumbLabel, path: basePath },
    { name: page.title, path: resolvedPath },
  ], { siteUrl });
  const faqJsonLd =
    page.faqs.length > 0 ? buildFaqJsonLd(page.faqs) : null;
  const serviceJsonLd = buildServiceJsonLd({
    title: page.title,
    description: page.description,
    path: resolvedPath,
    siteUrl,
  });
  const heroPrimaryCta = page.heroCta?.href || "/contact";
  const heroPrimaryLabel = page.heroCta?.label || "Konsultasi Kebutuhan";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={serviceJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <section className="container py-12 md:py-16">
        <div className="surface-card overflow-hidden rounded-3xl border border-border/70">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-12">
            <div>
              {page.badge ? (
                <p className="text-ui-label text-primary/80">{page.badge}</p>
              ) : null}
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                {page.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base text-foreground/72 md:text-lg">
                {page.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <GlobalWhatsAppButton
                  fallbackHref={heroPrimaryCta}
                  fallbackLabel={heroPrimaryLabel}
                  size="lg"
                />
                <GlobalWhatsAppButton
                  fallbackHref="/contact"
                  fallbackLabel="Minta Estimasi"
                  size="lg"
                  variant="outline"
                />
              </div>

              {(page.businessType || page.businessAddress || page.businessPhone) ? (
                <div className="mt-8 grid gap-3 text-sm text-foreground/72 md:grid-cols-3">
                  {page.businessType ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-foreground/60" />
                      <span>{page.businessType}</span>
                    </div>
                  ) : null}
                  {page.businessAddress ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-foreground/60" />
                      <span>{page.businessAddress}</span>
                    </div>
                  ) : null}
                  {page.businessPhone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-foreground/60" />
                      <span>{page.businessPhone}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="surface-muted rounded-2xl p-5">
              <p className="text-ui-label text-foreground/70">Ringkasan Cepat</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                {page.metrics.length > 0 ? (
                  page.metrics.map((metric) => (
                    <div
                      key={`${metric.value}-${metric.label}`}
                      className="rounded-xl border border-border/60 bg-background px-4 py-3"
                    >
                      <p className="text-xl font-semibold">{metric.value}</p>
                      <p className="mt-1 text-sm text-foreground/70">{metric.label}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-border/60 bg-background px-4 py-3">
                    <p className="text-sm text-foreground/70">
                      Halaman ini dirender langsung dari source JSON Astro dan sudah dinormalisasi ke contract code-driven.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {page.features.length > 0 ? (
        <section className="container section-divider py-12">
          <SectionHeading
            eyebrow="Keunggulan"
            title="Poin Utama Layanan"
            description={`Fokus eksekusi ${page.businessType || "layanan ini"} dirancang agar keputusan bisnis lebih cepat dan minim trial-error.`}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.features.map((item) => (
              <article key={item.title} className="surface-card rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 size-4 text-primary/80" />
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-2 text-sm text-foreground/72">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.services.length > 0 ? (
        <section className="container section-divider py-12">
          <SectionHeading
            eyebrow="Layanan"
            title="Layanan yang Ditawarkan"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {page.services.map((item) => (
              <article key={item.title} className="surface-card rounded-2xl p-5">
                <h3 className="text-lg font-medium">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm text-foreground/72">{item.description}</p>
                ) : null}
                {item.features?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-foreground/72">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-primary/80" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.href ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.href}>Pelajari Detail</Link>
                    </Button>
                    <GlobalWhatsAppButton
                      fallbackHref="/contact"
                      fallbackLabel="Diskusikan Scope"
                      size="sm"
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.reasons.length > 0 || page.deliverables.length > 0 ? (
        <section className="container section-divider py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {page.reasons.length > 0 ? (
              <div className="surface-card rounded-2xl p-5">
                <SectionHeading title="Mengapa Memilih Layanan Ini" />
                <div className="mt-5 space-y-3">
                  {page.reasons.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border/60 p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-2 text-sm text-foreground/72">{item.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {page.deliverables.length > 0 ? (
              <div className="surface-card rounded-2xl p-5">
                <SectionHeading title="Apa yang Anda Dapatkan" />
                <div className="mt-5 space-y-3">
                  {page.deliverables.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border/60 p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-2 text-sm text-foreground/72">{item.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 bg-background px-5 py-4">
            <p className="text-sm text-foreground/72">
              Perlu validasi cepat sebelum mulai? Kami bisa bantu mapping prioritas eksekusi agar biaya dan timeline tetap realistis.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <GlobalWhatsAppButton
                fallbackHref="/contact"
                fallbackLabel="Konsultasi Prioritas"
                size="sm"
              />
              <Button asChild size="sm" variant="outline">
                <Link href="#faq">Lihat FAQ Implementasi</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {page.pricing.length > 0 ? (
        <section className="container section-divider py-12">
          <SectionHeading
            eyebrow="Pricing"
            title="Paket dan Estimasi Biaya"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {page.pricing.map((item) => (
              <article key={item.title} className="surface-card rounded-2xl p-5">
                {item.badge ? (
                  <p className="text-ui-label text-primary/80">{item.badge}</p>
                ) : null}
                <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                {item.price ? (
                  <p className="mt-3 text-2xl font-semibold">{item.price}</p>
                ) : null}
                {item.description ? (
                  <p className="mt-2 text-sm text-foreground/72">{item.description}</p>
                ) : null}
                {item.features?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-foreground/72">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-primary/80" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-4">
                  <GlobalWhatsAppButton
                    fallbackHref="/contact"
                    fallbackLabel="Pilih Paket Ini"
                    size="sm"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.testimonials.length > 0 ? (
        <section className="container section-divider py-12">
          <SectionHeading eyebrow="Testimoni" title="Apa Kata Klien" />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {page.testimonials.map((item, index) => (
              <article key={`${item.name}-${index}`} className="surface-card rounded-2xl p-5">
                <Quote className="size-5 text-primary/80" />
                <p className="mt-4 text-sm leading-7 text-foreground/80">
                  {item.quote}
                </p>
                <div className="mt-4">
                  <p className="font-medium">{item.name}</p>
                  {item.role ? (
                    <p className="text-sm text-foreground/60">{item.role}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.faqs.length > 0 ? (
        <section id="faq" className="container section-divider py-12">
          <SectionHeading eyebrow="FAQ" title="Pertanyaan Umum" />
          <div className="mt-6 space-y-3">
            {page.faqs.map((item) => (
              <article key={item.question} className="surface-card rounded-2xl p-5">
                <h3 className="font-medium">{item.question}</h3>
                <p className="mt-2 text-sm text-foreground/72">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlobalWhatsAppButton fallbackHref="/contact" fallbackLabel="Ajukan Pertanyaan Lain" />
            <GlobalWhatsAppButton
              fallbackHref={heroPrimaryCta}
              fallbackLabel={heroPrimaryLabel}
              variant="outline"
            />
          </div>
        </section>
      ) : null}

      {page.contentSections.length > 0 ? (
        <section className="container section-divider py-12">
          <SectionHeading eyebrow="Konten" title="Informasi Tambahan" />
          <div className="mt-6 space-y-4">
            {page.contentSections.map((item, index) => (
              <article key={`${item.title || "content"}-${index}`} className="surface-card rounded-2xl p-5">
                {item.title ? (
                  <h3 className="text-lg font-medium">{item.title}</h3>
                ) : null}
                <p className="mt-2 text-sm leading-7 text-foreground/72">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.finalCta ? (
        <section className="container py-12 md:py-16">
          <div className="surface-muted rounded-3xl border border-border/70 px-6 py-8 text-center md:px-10 md:py-12">
            <p className="text-ui-label text-primary/80">Langkah Berikutnya</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
              {page.finalCta.title}
            </h2>
            {page.finalCta.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/72">
                {page.finalCta.description}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {page.finalCta.primaryLabel ? (
                <GlobalWhatsAppButton
                  fallbackHref={page.finalCta.primaryHref || "/contact"}
                  fallbackLabel={page.finalCta.primaryLabel}
                  size="lg"
                />
              ) : null}
              {page.finalCta.secondaryLabel ? (
                <GlobalWhatsAppButton
                  fallbackHref={page.finalCta.secondaryHref || "/contact"}
                  fallbackLabel={page.finalCta.secondaryLabel}
                  size="lg"
                  variant="outline"
                />
              ) : (
                <GlobalWhatsAppButton
                  fallbackHref="/contact"
                  fallbackLabel="Minta Rekomendasi Paket"
                  size="lg"
                  variant="outline"
                />
              )}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
