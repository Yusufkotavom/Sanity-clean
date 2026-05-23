import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generateBasicMetadata, generatePageMetadata } from "@/sanity/lib/metadata";

function SetupGuide() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight">🚀 Setup Guide</h1>
      <p className="mt-3 text-muted-foreground">
        Sanity dataset belum terisi. Ikuti langkah berikut untuk memulai:
      </p>
      <ol className="mt-8 space-y-6 text-sm">
        <li className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
          <div>
            <p className="font-semibold">Import Seed Dataset</p>
            <code className="mt-1 block rounded bg-muted px-3 py-2 text-xs">./scripts/seed-import.sh your-project-id production</code>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
          <div>
            <p className="font-semibold">Konfigurasi Environment</p>
            <code className="mt-1 block rounded bg-muted px-3 py-2 text-xs whitespace-pre">{`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com`}</code>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
          <div>
            <p className="font-semibold">Deploy Studio</p>
            <code className="mt-1 block rounded bg-muted px-3 py-2 text-xs">cd studio && sanity deploy</code>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
          <div>
            <p className="font-semibold">Edit Konten di Studio</p>
            <p className="mt-1 text-muted-foreground">Buka Sanity Studio, edit halaman Home (slug: index), lalu publish.</p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">5</span>
          <div>
            <p className="font-semibold">Build & Deploy</p>
            <code className="mt-1 block rounded bg-muted px-3 py-2 text-xs">pnpm build</code>
          </div>
        </li>
      </ol>
      <div className="mt-10 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Atau jalankan seed script langsung:</p>
        <code className="mt-2 block">SANITY_TOKEN=your-token node scripts/seed-production.mjs</code>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "index" });
  if (page) {
    return generatePageMetadata({ page, slug: "index" });
  }
  return generateBasicMetadata({ slug: "index" });
}

export default async function IndexPage() {
  const page = await fetchSanityPageBySlug({ slug: "index" });
  if (!page) return <SetupGuide />;

  return <Blocks blocks={page.blocks ?? []} pageTitle={page.title} />;
}
