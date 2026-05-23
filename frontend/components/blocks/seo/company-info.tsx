import { cleanString as stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import { fetchSeoSettings } from "@/sanity/lib/fetch";
import { Building2, MapPin, Phone, Mail } from "lucide-react";
import { ColorVariant, SectionPadding } from "@/sanity.types";

type CompanyInfoBlock = {
  _type: "company-info";
  _key: string;
  padding?: string;
  colorVariant?: string;
  title?: string;
  description?: string;
};

export default async function CompanyInfo({
  padding,
  colorVariant,
  title,
  description,
}: CompanyInfoBlock) {
  const color = stegaClean(colorVariant) as ColorVariant | null;
  const pad = padding as unknown as SectionPadding | null;
  const seoSettings = await fetchSeoSettings();
  const c = seoSettings?.companyInfo;

  if (!c) return null;

  return (
    <SectionContainer color={color} padding={pad}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title || "Tentang Kotacom"}
          </h2>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="mb-8 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">{c.foundedYear}</div>
            <div className="text-xs text-muted-foreground">Berdiri</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{c.totalClients}+</div>
            <div className="text-xs text-muted-foreground">Klien</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{c.totalProjects}+</div>
            <div className="text-xs text-muted-foreground">Proyek</div>
          </div>
        </div>

        {/* Contact + Address */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/40 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" /> Lokasi
            </h3>
            <p className="text-sm text-muted-foreground">{c.addressSidoarjo}</p>
            {c.addressSurabaya && (
              <p className="mt-2 text-sm text-muted-foreground">{c.addressSurabaya}</p>
            )}
          </div>
          <div className="rounded-xl border border-border/40 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Phone className="size-4 text-primary" /> Kontak
            </h3>
            <p className="text-sm text-muted-foreground">{c.phone}</p>
            {c.email && (
              <p className="mt-1 text-sm text-muted-foreground">{c.email}</p>
            )}
            {c.operatingHours && (
              <p className="mt-1 text-xs text-muted-foreground/70">{c.operatingHours}</p>
            )}
          </div>
        </div>

        {/* Service areas inline */}
        {c.serviceAreas?.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Area layanan: {c.serviceAreas.join(" · ")}
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
