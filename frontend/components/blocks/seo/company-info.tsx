import { stegaClean } from "next-sanity";
import SectionContainer from "@/components/ui/section-container";
import GlassCard from "@/components/ui/glass-card";
import { fetchSeoSettings } from "@/sanity/lib/fetch";
import { Building2, Award, Trophy, Users, Briefcase, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
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
  const companyInfo = seoSettings?.companyInfo;

  if (!companyInfo) return null;

  return (
    <SectionContainer color={color} padding={pad}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title || "Tentang Kotacom"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {description || "Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <GlassCard className="text-center">
            <Building2 className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="text-3xl font-bold">{companyInfo.foundedYear}</div>
            <div className="text-sm text-muted-foreground mt-1">Tahun Berdiri</div>
          </GlassCard>
          <GlassCard className="text-center">
            <Users className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="text-3xl font-bold">{companyInfo.totalClients}+</div>
            <div className="text-sm text-muted-foreground mt-1">Klien Puas</div>
          </GlassCard>
          <GlassCard className="text-center">
            <Briefcase className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="text-3xl font-bold">{companyInfo.totalProjects}+</div>
            <div className="text-sm text-muted-foreground mt-1">Proyek Selesai</div>
          </GlassCard>
          <GlassCard className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="text-3xl font-bold">{companyInfo.serviceAreas?.length || 6}</div>
            <div className="text-sm text-muted-foreground mt-1">Area Layanan</div>
          </GlassCard>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Kantor Sidoarjo
            </h3>
            <p className="text-sm text-muted-foreground">{companyInfo.addressSidoarjo}</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Kantor Surabaya
            </h3>
            <p className="text-sm text-muted-foreground">{companyInfo.addressSurabaya}</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Telepon / WhatsApp</div>
                <div className="font-medium">{companyInfo.phone}</div>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{companyInfo.email}</div>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Jam Operasional</div>
                <div className="font-medium text-sm">{companyInfo.operatingHours}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Certifications & Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyInfo.certifications && companyInfo.certifications.length > 0 && (
            <GlassCard>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Sertifikasi
              </h3>
              <ul className="space-y-2">
                {companyInfo.certifications.map((cert: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
          {companyInfo.awards && companyInfo.awards.length > 0 && (
            <GlassCard>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Penghargaan
              </h3>
              <ul className="space-y-2">
                {companyInfo.awards.map((award: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Trophy className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>

        {/* Service Areas */}
        {companyInfo.serviceAreas && companyInfo.serviceAreas.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Area Layanan Kami:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {companyInfo.serviceAreas.map((area: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
