import Blocks from "@/components/blocks";
import { fetchSanityBlocksShowcase } from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";

const SLUG = "sanity-blocks";

export async function generateMetadata() {
  return generateBasicMetadata({
    title: "Sanity Blocks Showcase",
    description:
      "Satu halaman untuk menampilkan semua tipe block Sanity yang tersedia di konten publik.",
    slug: SLUG,
  });
}

export default async function SanityBlocksPage() {
  const showcase = await fetchSanityBlocksShowcase();

  if (showcase.blocks.length === 0) {
    return (
      <section className="container py-16 xl:py-20">
        <h1 className="text-3xl font-bold md:text-4xl">Sanity Blocks Showcase</h1>
        <p className="mt-3 max-w-3xl text-foreground/70">
          Belum ada block yang bisa ditampilkan. Tambahkan block pada dokumen
          <code> page</code>, <code>post</code>, <code>service</code>,
          <code> product</code>, atau <code>project</code> di Sanity Studio,
          lalu refresh halaman ini.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="container py-10 xl:py-14">
        <h1 className="text-3xl font-bold md:text-4xl">Sanity Blocks Showcase</h1>
        <p className="mt-3 max-w-4xl text-foreground/70">
          Halaman ini merender satu contoh untuk setiap tipe block yang ditemukan
          di konten Sanity publik.
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Total tipe block: <strong>{showcase.blockTypes.length}</strong> dari{" "}
          <strong>{showcase.sourceCount}</strong> dokumen sumber.
        </p>
      </section>
      <Blocks blocks={showcase.blocks} pageTitle="Sanity Blocks Showcase" />
    </>
  );
}
