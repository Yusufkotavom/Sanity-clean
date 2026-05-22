import Blocks from "@/components/blocks";
import { BLOCK_COMPONENT_TYPES } from "@/components/blocks";
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
  const available = new Set(showcase.blockTypes);
  const registeredTypes = [...BLOCK_COMPONENT_TYPES].sort();
  const missingTypes = registeredTypes.filter((type) => !available.has(type));

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
        <p className="mt-1 text-sm text-foreground/60">
          Total block yang didukung renderer: <strong>{registeredTypes.length}</strong>.
        </p>

        <div className="mt-5 rounded-2xl border border-foreground/10 bg-background/60 p-4">
          <p className="text-sm font-medium text-foreground/85">Status Cakupan Block</p>
          <p className="mt-1 text-xs text-foreground/60">
            Hijau: sudah ada contoh dari Sanity publik. Merah: belum ada contoh data.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {registeredTypes.map((type) => {
              const found = available.has(type);
              return (
                <span
                  key={type}
                  className={
                    found
                      ? "rounded-full border border-emerald-300/70 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300"
                      : "rounded-full border border-rose-300/70 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-700 dark:text-rose-300"
                  }
                >
                  {type}
                </span>
              );
            })}
          </div>
          {missingTypes.length > 0 ? (
            <p className="mt-3 text-xs text-foreground/60">
              Belum ada contoh untuk: {missingTypes.join(", ")}
            </p>
          ) : (
            <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
              Semua block yang didukung renderer sudah punya contoh.
            </p>
          )}
        </div>
      </section>
      <Blocks blocks={showcase.blocks} pageTitle="Sanity Blocks Showcase" />
    </>
  );
}
