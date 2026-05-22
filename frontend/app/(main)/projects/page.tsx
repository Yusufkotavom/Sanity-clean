import ProjectGrid from "@/components/projects/project-grid";
import { fetchSanityProjects, fetchSanitySeoSettings } from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import { Suspense } from "react";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";

export async function generateMetadata() {
  return await generateBasicMetadata({
    title: "Portfolio Proyek DEVK STUDIO",
    description:
      "Lihat portofolio proyek website, software, dan percetakan yang telah diselesaikan DEVK STUDIO untuk berbagai klien di Indonesia.",
    slug: "projects",
  });
}

export default async function ProjectsPage() {
  const [projects, seo] = await Promise.all([
    fetchSanityProjects(),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/projects" },
  ], { siteUrl });

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Portfolio Proyek – DEVK STUDIO",
    description:
      "Portofolio website, software, dan percetakan oleh DEVK STUDIO.",
    url: "/projects",
    siteUrl,
    items: (projects as any[])
      .filter((p: any) => p.title && p.slug?.current)
      .map((p: any) => ({
        name: p.title,
        url: `/projects/${p.slug.current}`,
      })),
  });

  return (
    <section>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <div className="container py-16 xl:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold md:text-5xl">Portfolio</h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Jelajahi portofolio proyek website, software custom, dan percetakan yang telah kami selesaikan untuk klien dari berbagai industri.
          </p>
        </div>
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Memuat...</div>}>
          <ProjectGrid projects={projects as any[]} />
        </Suspense>
      </div>
    </section>
  );
}
