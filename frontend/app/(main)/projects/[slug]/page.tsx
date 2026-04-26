import { notFound } from "next/navigation";
import Blocks from "@/components/blocks";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import InlineMetaList from "@/components/ui/inline-meta-list";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import GlobalWhatsAppPanel from "@/components/global-whatsapp-panel";
import { Code, ExternalLink, Link as LinkIcon } from "lucide-react";
import {
  fetchSanityProjectBySlug,
  fetchSanityProjectsStaticParams,
  fetchSanitySeoSettings,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-jsonld";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const projects = await fetchSanityProjectsStaticParams();

  return projects.map((project) => ({
    slug: project.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const project = await fetchSanityProjectBySlug({ slug: params.slug });

  if (!project) notFound();
  return await generatePageMetadata({ page: project, slug: `projects/${params.slug}` });
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [project, seo] = await Promise.all([
    fetchSanityProjectBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  if (!project) notFound();

  const links: BreadcrumbLink[] = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: project.title as string, href: "#" },
  ];
  const projectPath = `/projects/${params.slug}`;
  const articleJsonLd = buildArticleJsonLd({
    title: project.title || "",
    description: project.meta?.description || project.excerpt,
    path: projectPath,
    image: project.meta?.image || project.image,
    datePublished: project._createdAt || undefined,
    dateModified: project._updatedAt || undefined,
    siteUrl,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title || "Project", path: projectPath },
  ], { siteUrl });

  return (
    <section>
      <JsonLd data={articleJsonLd} />
      {/* Hero Banner Split Layout */}
      <div className="container py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] items-start">
          {/* Left: Thumbnail */}
          {project.image?.asset?._id && (
            <div className="relative w-full overflow-hidden rounded-2xl border shadow-sm">
              <Image
                src={urlFor(project.image).width(960).quality(85).url()}
                alt={project.image.alt || ""}
                width={800}
                height={1200}
                className="w-full h-auto object-cover object-top"
                placeholder={project.image?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={project.image?.asset?.metadata?.lqip || ""}
                priority
              />
            </div>
          )}

          {/* Right: Title, Meta, and Actions */}
          <div className="mt-2 text-left">
            <Breadcrumbs links={links} />
            <h1 className="mt-4 mb-4 text-4xl font-bold lg:text-5xl">{project.title}</h1>
            {project.excerpt && (
              <p className="mb-6 text-lg text-foreground/80">{project.excerpt}</p>
            )}
            
            <InlineMetaList
              className="mb-8"
              items={[
                project.projectType ? `Type: ${project.projectType.replace("-", " ")}` : undefined,
                project.categories?.length > 0 ? `Categories: ${project.categories.map((c: any) => c.title).join(", ")}` : undefined,
                project.clientName ? `Client: ${project.clientName}` : undefined,
                project.industry ? `Industry: ${project.industry}` : undefined,
                project.completionYear ? `Year: ${project.completionYear}` : undefined,
              ]}
            />
            
            {/* Call to Actions at the Top */}
            <div className="flex flex-wrap items-center gap-3">
              {project.previewUrl && (
                <Button asChild size="lg">
                  <Link href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 size-4" />
                    Live Preview
                  </Link>
                </Button>
              )}
              {project.repositoryUrl && (
                <Button asChild variant="secondary" size="lg">
                  <Link href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <Code className="mr-2 size-4" />
                    Source Repository
                  </Link>
                </Button>
              )}
              {project.projectUrl && !project.previewUrl && (
                <Button asChild variant="secondary" size="lg">
                  <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-2 size-4" />
                    Visit Project
                  </Link>
                </Button>
              )}
              <GlobalWhatsAppButton
                fallbackHref={project.cta?.href || "/contact"}
                fallbackLabel={project.cta?.title || "Konsultasi via WhatsApp"}
                variant="default"
                size="lg"
                className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 xl:py-16">
        <article className="mx-auto max-w-4xl">
          {project.body && <PortableTextRenderer value={project.body} />}

          {/* Sanity Page Blocks */}
          {(project as any)?.blocks?.length > 0 && (
            <div className="mt-10">
              <Blocks blocks={(project as any).blocks} pageTitle={project.title} />
            </div>
          )}
          <GlobalWhatsAppPanel
            title={`Ingin proyek seperti ${project.title}?`}
            description="Kirim konteks bisnis Anda lewat WhatsApp. Kami bisa bantu memetakan kebutuhan, fitur prioritas, dan estimasi implementasi."
            secondaryHref={project.projectUrl || undefined}
            secondaryLabel={project.projectUrl ? "Visit Project" : undefined}
          />
        </article>
      </div>
    </section>
  );
}
