import Link from "next/link";
import Image from "next/image";
import {
  Blocks,
  LaptopMinimal,
  Network,
  Printer,
  Sparkles,
  Workflow,
  CheckCircle2,
  Trophy,
  MapPin,
  Clock3,
  Layers2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import {
  SectionIntro,
  SectionPanel,
  SectionShell,
} from "@/components/ui/section-shell";
import { cn } from "@/lib/utils";
import {
  fetchSanityHomePosts,
  fetchSanityHomeProducts,
  fetchSanityHomeProjects,
  fetchSanityHomeServices,
} from "@/sanity/lib/fetch";
import {
  fetchHomeContent,
  fetchSiteSettings,
  fetchServiceLanes,
  fetchServiceClusters,
} from "@/sanity/lib/content";
import ProjectCard from "@/components/ui/project-card";
import ProductCard from "@/components/ui/product-card";
import PostCard from "@/components/ui/post-card";
import ServiceCard from "@/components/ui/service-card";
import HomeWhyChoose from "@/components/home-why-choose";
import HomeFAQ from "@/components/home-faq";

const laneIconMap = {
  website: LaptopMinimal,
  software: Blocks,
  support: Network,
  printing: Printer,
} as const;

const proofPoints = [
  {
    title: "Scope Lebih Jelas di Awal",
    description:
      "Kebutuhan dipetakan menjadi prioritas kerja supaya tim bisnis tidak menebak langkah berikutnya.",
    icon: Layers2,
  },
  {
    title: "Eksekusi Lebih Cepat",
    description:
      "Website, software, support, dan percetakan dikelola dalam satu ritme delivery tanpa handoff berulang.",
    icon: Clock3,
  },
  {
    title: "Support Setelah Rilis",
    description:
      "Pendampingan pasca-go-live membantu perbaikan kecil dan penyesuaian berjalan tanpa mengganggu operasional.",
    icon: ShieldCheck,
  },
] as const;

export default async function HomePeparMiddleSection() {
  const [
    recentProjects,
    recentProducts,
    recentServices,
    recentPosts,
    homeContent,
    siteSettings,
    serviceLanes,
    serviceClusters,
  ] = await Promise.all([
    fetchSanityHomeProjects(),
    fetchSanityHomeProducts(),
    fetchSanityHomeServices(),
    fetchSanityHomePosts(),
    fetchHomeContent(),
    fetchSiteSettings(),
    fetchServiceLanes(),
    fetchServiceClusters(),
  ]);

  // Fallback to hardcoded values if Sanity data is not available
  const heroTitle = homeContent?.heroTitle || "Website, software, IT support, dan percetakan dalam satu jalur kerja.";
  const heroDescription = homeContent?.heroDescription || "Kami membantu bisnis bergerak dari brief ke implementasi dengan scope yang jelas, timeline realistis, dan pendampingan sampai sistem benar-benar dipakai.";
  const foundedYear = homeContent?.foundedYear || siteSettings?.foundedYear || 2008;
  const projectsCompleted = homeContent?.projectsCompleted || siteSettings?.projectsCompleted || 150;
  const location = homeContent?.location || siteSettings?.location || "Surabaya";
  const coverage = homeContent?.coverage || siteSettings?.coverage || "Jangkauan Nasional";
  const techStack = siteSettings?.techStack || [
    "React", "Next.js", "Astro.js", "Node.js", "Laravel", "Python",
    "PostgreSQL", "MongoDB", "AWS", "Google Cloud", "Flutter", "Docker"
  ];

  return (
    <>
      <section className="section-divider relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background pt-14 pb-10 lg:pt-20 lg:pb-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,hsl(var(--primary)/0.16),transparent_40%),radial-gradient(circle_at_88%_24%,hsl(var(--primary)/0.12),transparent_36%)]" />
        <div className="container relative">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.86fr)]">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 text-ui-label text-foreground/60">
                <Sparkles className="size-4" />
                <span>{homeContent?.heroEyebrow || "Partner Eksekusi Digital"}</span>
              </div>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                {heroDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link href={homeContent?.heroPrimaryCta?.href || "/services"}>
                    {homeContent?.heroPrimaryCta?.label || "Lihat Solusi untuk Bisnis Anda"}
                  </Link>
                </Button>
                <GlobalWhatsAppButton
                  label={homeContent?.heroSecondaryCta?.label || "Diskusikan Kebutuhan Anda"}
                  variant="outline"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-white/45 bg-white/70 shadow-[0_18px_48px_rgba(15,23,42,0.1)] dark:border-white/12 dark:bg-white/5">
                <Image
                  src={homeContent?.heroImage?.asset?.url || "/images/kotacom-split-production-ready/hero/hero-cetak-buku-shark-v2.png"}
                  alt={homeContent?.heroImage?.alt || "Ilustrasi layanan website, software, support, dan percetakan Kotacom"}
                  fill
                  className="object-contain p-4"
                  priority
                  quality={85}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. HERO EXTENSION: Stats Bar */}
      <SectionShell className="pt-12 lg:pt-16">
        <div className="mx-auto flex max-w-[1000px] flex-wrap justify-between gap-6 rounded-[1.9rem] border border-border/50 bg-background/50 px-8 py-8 shadow-sm backdrop-blur-sm sm:px-12">
          <div className="flex flex-1 items-center gap-4">
            <Trophy className="h-8 w-8 text-primary/70" />
            <div>
              <div className="text-2xl font-bold tracking-tight">{foundedYear}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Berdiri Sejak</div>
            </div>
          </div>
          <div className="hidden h-12 w-px bg-border/50 md:block" />
          <div className="flex flex-1 items-center gap-4 md:justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary/70" />
            <div>
              <div className="text-2xl font-bold tracking-tight">{projectsCompleted}+</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Proyek Selesai</div>
            </div>
          </div>
          <div className="hidden h-12 w-px bg-border/50 md:block" />
          <div className="flex flex-1 items-center gap-4 md:justify-end">
            <MapPin className="h-8 w-8 text-primary/70" />
            <div>
              <div className="text-2xl font-bold tracking-tight">{location}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{coverage}</div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-12 lg:pt-16">
        <SectionPanel
          tone="neutral"
          className="grid gap-8 overflow-hidden rounded-[1.9rem] p-5 md:grid-cols-[minmax(0,1.2fr)_360px] md:p-7 lg:gap-10 lg:p-8"
        >
          <div className="space-y-6">
            <SectionIntro
              eyebrow={homeContent?.servicesEyebrow || "Layanan Utama Kotacom"}
              title={homeContent?.servicesTitle || "Empat layanan utama yang saling melengkapi untuk membantu bisnis bergerak lebih rapi."}
              description={homeContent?.servicesDescription || "Mulai dari website, software, support, hingga percetakan, setiap layanan dirancang agar bisa berdiri sendiri atau digabung menjadi sistem kerja yang lebih utuh."}
              className="mb-0 max-w-4xl"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {serviceLanes && serviceLanes.length > 0 ? serviceLanes.map((lane: any) => {
                const Icon = laneIconMap[lane.key as keyof typeof laneIconMap] || Blocks;

                return (
                  <Link
                    className="group rounded-[1.35rem] border border-border/70 bg-background/85 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-background hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]"
                    href={lane.href}
                    key={lane._id}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-primary/10 text-foreground">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {lane.eyebrow}
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {lane.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                // Fallback to hardcoded lanes if Sanity data is not available
                [
                  { key: "website", eyebrow: "Website Development", title: "Website profesional", href: "/pembuatan-website" },
                  { key: "software", eyebrow: "Software Development", title: "Software custom", href: "/software" },
                  { key: "support", eyebrow: "IT Support & Infra", title: "Support teknis", href: "/services" },
                  { key: "printing", eyebrow: "Printing & Design", title: "Percetakan", href: "/percetakan" },
                ].map((lane) => {
                  const Icon = laneIconMap[lane.key as keyof typeof laneIconMap];
                  return (
                    <Link
                      className="group rounded-[1.35rem] border border-border/70 bg-background/85 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-background hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]"
                      href={lane.href}
                      key={lane.key}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-primary/10 text-foreground">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {lane.eyebrow}
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {lane.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-border/70 bg-background/90 p-6 shadow-[0_18px_70px_-42px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/40">
                <Workflow className="h-4 w-4" />
              </span>
              {homeContent?.workflowTitle || "Cara kami bekerja"}
            </div>
            <div className="mt-5 space-y-4">
              {homeContent?.workflowSteps && homeContent.workflowSteps.length > 0 ? homeContent.workflowSteps.map((item: any, index: number) => (
                <div className="border-l border-border/70 pl-4" key={item.title}>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Step {index + 1}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )) : (
                // Fallback workflow steps
                [
                  { title: "Pahami kebutuhan bisnis", description: "Kami mulai dari tujuan, hambatan operasional, dan target yang ingin dicapai agar solusi yang dibuat benar-benar relevan." },
                  { title: "Susun solusi yang realistis", description: "Setelah arahnya jelas, kami bantu memetakan prioritas, scope kerja, timeline, dan bentuk implementasi yang paling masuk akal." },
                  { title: "Eksekusi dan pendampingan", description: "Pekerjaan tidak berhenti saat rilis. Kami lanjutkan dengan support, evaluasi, dan penyesuaian agar hasilnya tetap berguna di lapangan." },
                ].map((item, index) => (
                  <div className="border-l border-border/70 pl-4" key={item.title}>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Step {index + 1}
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground">
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <GlobalWhatsAppButton
                label="Konsultasi via WhatsApp"
                variant="outline"
                size="sm"
              />
              <Button asChild variant="ghost" size="sm">
                <Link href="/services">Lihat semua layanan</Link>
              </Button>
            </div>
          </div>
        </SectionPanel>
      </SectionShell>

      <SectionShell>
        <SectionIntro
          eyebrow="Teknologi yang Kami Gunakan"
          title="Stack yang dipilih untuk membantu performa, stabilitas, dan kemudahan pengembangan."
          description="Kami menggunakan teknologi yang relevan dengan kebutuhan proyek, bukan sekadar mengikuti tren."
        />
        <div className="flex flex-wrap gap-3">
          {techStack.map((item: string) => (
            <div
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-5 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/60"
              key={item}
            >
              <Sparkles className="h-3 w-3 text-muted-foreground/60" />
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      {/* 2. PORTFOLIO PREVIEW */}
      {recentProjects.length > 0 && (
        <SectionShell>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Portfolio & Case Studies"
              title="Proyek terbaru yang kami selesaikan."
              description="Beberapa contoh dari sistem, website, dan proyek IT yang kami kerjakan."
              className="mb-0"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/projects">Semua Portfolio</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project: any) => (
              <ProjectCard key={project._id || (project.slug && project.slug.current)} {...project} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/projects">Semua Portfolio</Link>
            </Button>
          </div>
        </SectionShell>
      )}

      {/* PRODUCTS PREVIEW */}
      {recentProducts.length > 0 && (
        <SectionShell>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Katalog Produk"
              title="Perangkat Kasir & IT"
              description="Pilihan produk dengan kualitas terbaik untuk mendukung kegiatan bisnis Anda."
              className="mb-0"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/products">Semua Produk</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProducts.map((product: any) => (
              <ProductCard key={product._id || (product.slug && product.slug.current)} {...product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">Semua Produk</Link>
            </Button>
          </div>
        </SectionShell>
      )}

      {/* SERVICES PREVIEW */}
      {recentServices.length > 0 && (
        <SectionShell>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Layanan Tersedia"
              title="Solusi Teknis Khusus"
              description="Dari instalasi jaringan hingga percetakan dalam skala besar."
              className="mb-0"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/services">Semua Layanan</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentServices.map((service: any) => (
              <ServiceCard key={service._id || (service.slug && service.slug.current)} {...service} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/services">Semua Layanan</Link>
            </Button>
          </div>
        </SectionShell>
      )}

      {/* BLOG/POSTS PREVIEW */}
      {recentPosts.length > 0 && (
        <SectionShell>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Artikel & Insights"
              title="Informasi Terbaru & Tips IT"
              description="Baca artikel seputar solusi teknologi dan tren industri dari tim ahli kami."
              className="mb-0"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/blog">Semua Artikel</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post: any) => (
              <PostCard key={post._id || (post.slug && post.slug.current)} {...post} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/blog">Semua Artikel</Link>
            </Button>
          </div>
        </SectionShell>
      )}

      <SectionShell>
        <SectionIntro
          eyebrow="Fokus Layanan"
          title="Layanan yang bisa dipakai terpisah atau disusun menjadi solusi yang lebih lengkap."
          description="Setiap lane dirancang untuk menjawab kebutuhan yang berbeda, tetapi tetap bisa saling terhubung saat bisnis membutuhkan alur kerja yang lebih utuh."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {serviceLanes && serviceLanes.length > 0 ? serviceLanes.map((lane: any) => {
            const Icon = laneIconMap[lane.key as keyof typeof laneIconMap] || Blocks;

            return (
              <SectionPanel
                className="rounded-[1.75rem] p-6 md:p-7"
                key={lane._id}
                tone={lane.key === "software" ? "sky" : "neutral"}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-ui-label text-foreground/55">{lane.eyebrow}</div>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                      {lane.title}
                    </h3>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/70 bg-primary/10">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                  {lane.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {lane.bullets?.map((bullet: string) => (
                    <li
                      className="flex items-center gap-3 text-sm text-foreground/90"
                      key={bullet}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={lane.href}>Buka lane</Link>
                  </Button>
                </div>
              </SectionPanel>
            );
          }) : (
            // Fallback lanes if Sanity data is not available
            [
              {
                key: "website",
                eyebrow: "Website Development",
                title: "Website profesional",
                description: "Untuk company profile, landing page, sekolah, toko online, dan kebutuhan promosi yang perlu struktur informasi rapi serta alur konversi yang kuat.",
                href: "/pembuatan-website",
                bullets: ["Company profile", "Landing page", "Toko online"],
              },
              {
                key: "software",
                eyebrow: "Software Development",
                title: "Software custom",
                description: "Cocok untuk dashboard bisnis, POS, CRM, otomasi operasional, dan integrasi proses yang membutuhkan sistem kerja sendiri.",
                href: "/software",
                bullets: ["POS & dashboard", "CRM & operasional", "Integrasi proses"],
              },
              {
                key: "support",
                eyebrow: "IT Support & Infra",
                title: "Support teknis",
                description: "Layanan support, network setup, administrasi server, dan konsultasi teknis untuk menjaga ritme kerja tim tetap lancar.",
                href: "/services",
                bullets: ["IT support", "Network setup", "System administration"],
              },
              {
                key: "printing",
                eyebrow: "Printing & Design",
                title: "Percetakan",
                description: "Buku, brosur, kalender, seminar kit, dan materi promosi lain yang dirancang untuk kebutuhan bisnis, event, dan branding.",
                href: "/percetakan",
                bullets: ["Cetak buku", "Brosur & kalender", "Materi promosi"],
              },
            ].map((lane) => {
              const Icon = laneIconMap[lane.key as keyof typeof laneIconMap];
              return (
                <SectionPanel
                  className="rounded-[1.75rem] p-6 md:p-7"
                  key={lane.key}
                  tone={lane.key === "software" ? "sky" : "neutral"}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-ui-label text-foreground/55">{lane.eyebrow}</div>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                        {lane.title}
                      </h3>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/70 bg-primary/10">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    {lane.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {lane.bullets.map((bullet) => (
                      <li
                        className="flex items-center gap-3 text-sm text-foreground/90"
                        key={bullet}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button asChild variant="outline">
                      <Link href={lane.href}>Buka lane</Link>
                    </Button>
                  </div>
                </SectionPanel>
              );
            })
          )}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionPanel
          tone="amber"
          className="grid gap-6 rounded-[1.9rem] p-6 md:grid-cols-[minmax(0,1fr)_320px] md:p-8"
        >
          <div>
            <SectionIntro
              eyebrow="Kenapa Banyak Bisnis Memilih Kotacom"
              title="Bukan hanya karena layanan yang lengkap, tetapi karena eksekusinya bisa dibuat lebih terarah."
              description="Kami membantu bisnis menyusun prioritas, memperjelas kebutuhan, dan menyiapkan implementasi yang bisa benar-benar dipakai."
              className="mb-0 max-w-3xl"
            />
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Satu partner, lebih sedikit handoff",
                description: "Website, software, support, dan printing bisa berjalan sendiri-sendiri, tetapi akan jauh lebih efektif ketika dirancang sebagai satu alur kerja yang saling mendukung.",
              },
              {
                title: "Dari build sampai pendampingan",
                description: "Nilai Kotacom bukan hanya di build awal, tetapi di kemampuan menjaga ritme setelah launch lewat support, iterasi, maintenance, dan penyesuaian yang dibutuhkan bisnis.",
              },
              {
                title: "Pesan layanan lebih mudah dipahami",
                description: "Pengunjung perlu cepat mengerti apa yang dikerjakan Kotacom, siapa yang dibantu, dan langkah berikutnya tanpa harus membaca terlalu banyak penjelasan teknis.",
              },
            ].map((item) => (
              <div
                className="rounded-[1.35rem] border border-border/70 bg-background/90 p-4"
                key={item.title}
              >
                <div className="text-sm font-medium text-foreground">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </SectionShell>

      {/* OPERATIONAL PROOF SECTION */}
      <SectionShell>
        <SectionIntro
          eyebrow="Kenapa Tim Bisnis Memilih Kotacom"
          title="Fokus pada hasil kerja yang bisa langsung dipakai."
          description="Pendekatan ini kami pakai agar bisnis bisa mengambil keputusan lebih cepat dan menjalankan delivery tanpa kebingungan antar vendor."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="rounded-[1.75rem] border border-border/50 bg-background/60 p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-primary/10">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{point.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{point.description}</p>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionIntro
          eyebrow="Layanan Unggulan"
          title="Tiga penawaran yang paling sering dicari bisnis saat ingin mulai bekerja bersama Kotacom."
          description="Blok ini membantu pengunjung memahami jalur layanan yang paling relevan tanpa harus menelusuri terlalu banyak halaman di awal."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {serviceClusters && serviceClusters.length > 0 ? serviceClusters.map((cluster: any, index: number) => (
            <SectionPanel
              className="rounded-[1.75rem] p-6 md:p-7"
              key={cluster._id}
              tone={index === 1 ? "sky" : "neutral"}
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {cluster.priceHint}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {cluster.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {cluster.description}
              </p>
              <ul className="mt-5 space-y-2">
                {cluster.bullets?.map((bullet: string) => (
                  <li className="flex items-center gap-3 text-sm" key={bullet}>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline" size="sm">
                  <Link href={cluster.href}>Lihat detail</Link>
                </Button>
              </div>
            </SectionPanel>
          )) : (
            // Fallback service clusters
            [
              {
                title: "Dukungan IT Profesional",
                description: "Layanan support yang membantu bisnis menjaga perangkat, jaringan, server, dan kebutuhan teknis tetap siap dipakai tanpa mengganggu ritme kerja.",
                href: "/services",
                priceHint: "Mulai dari support insidental hingga maintenance rutin",
                bullets: ["Macbook & Windows service", "Server maintenance", "Pengadaan alat IT"],
              },
              {
                title: "Jasa Pembuatan Website & Software",
                description: "Website dan software kami susun sebagai lane utama untuk bisnis yang ingin memperbaiki cara presentasi, cara kerja, dan alur penjualan sekaligus.",
                href: "/pembuatan-website",
                priceHint: "Mulai dari website bisnis hingga aplikasi custom",
                bullets: ["Website sekolah & perusahaan", "Custom web apps", "CRM, CMS, aplikasi bisnis"],
              },
              {
                title: "Layanan Percetakan",
                description: "Percetakan kami posisikan sebagai pelengkap trust dan distribusi materi bisnis, mulai dari buku, seminar kit, sampai kebutuhan promosi offline.",
                href: "/percetakan",
                priceHint: "Untuk buku, kalender, seminar kit, dan materi promosi",
                bullets: ["Jasa cetak buku", "Kalender & seminar kit", "Map, brosur, dan lainnya"],
              },
            ].map((cluster, index) => (
              <SectionPanel
                className="rounded-[1.75rem] p-6 md:p-7"
                key={cluster.title}
                tone={index === 1 ? "sky" : "neutral"}
              >
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {cluster.priceHint}
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {cluster.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {cluster.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {cluster.bullets.map((bullet) => (
                    <li className="flex items-center gap-3 text-sm" key={bullet}>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href={cluster.href}>Lihat detail</Link>
                  </Button>
                </div>
              </SectionPanel>
            ))
          )}
        </div>
      </SectionShell>

      <SectionShell className="pb-12 lg:pb-16">
        <SectionPanel tone="sky" className="rounded-[1.9rem] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
            <div>
              <div className="flex items-center gap-3 text-ui-label text-foreground/55">
                <Sparkles className="h-4 w-4" />
                Siap Mulai
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                {homeContent?.closingTitle || "Bangun solusi yang lebih rapi, lebih stabil, dan lebih siap dipakai untuk tumbuh."}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                {homeContent?.closingDescription || "Jika bisnis Anda butuh partner untuk website, software, support, atau percetakan, Kotacom siap membantu memetakan kebutuhan dan menyiapkan langkah yang paling relevan."}
              </p>
            </div>
            <div className="space-y-3">
              {homeContent?.assurancePoints && homeContent.assurancePoints.length > 0 ? homeContent.assurancePoints.map((item: any) => (
                <div
                  className={cn("rounded-[1.25rem] border border-border/70 bg-background/90 p-4")}
                  key={item.label}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {item.label}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              )) : (
                // Fallback assurance points
                [
                  { label: "Pendekatan terarah", value: "Kami bantu dari pemetaan kebutuhan sampai implementasi yang realistis." },
                  { label: "Eksekusi lintas layanan", value: "Website, software, support, dan percetakan bisa disusun sebagai satu alur kerja yang utuh." },
                  { label: "Siap ditindaklanjuti", value: "Konsultasi awal, penawaran, dan langkah mulai dirancang agar prospek bisa bergerak tanpa kebingungan." },
                ].map((item) => (
                  <div
                    className={cn("rounded-[1.25rem] border border-border/70 bg-background/90 p-4")}
                    key={item.label}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {item.label}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.value}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlobalWhatsAppButton
              label="Konsultasi Sekarang"
              className="rounded-full bg-green-500 text-white hover:bg-green-600"
            />
            <Button asChild variant="outline">
              <Link href="/contact">Kirim Brief Kebutuhan</Link>
            </Button>
          </div>
        </SectionPanel>
      </SectionShell>

      {/* Why Choose Kotacom Section */}
      <HomeWhyChoose />

      {/* FAQ Section */}
      <HomeFAQ />
    </>
  );
}
