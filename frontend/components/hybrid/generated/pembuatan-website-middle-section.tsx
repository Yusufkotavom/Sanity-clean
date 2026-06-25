import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PembuatanWebsiteMiddleSection() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Code-Owned Middle Section
            </span>
            <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Pembuatan Website sekarang siap memakai pola hybrid tanpa melepas kontrol struktur inti.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              File ini sengaja digenerate sebagai titik awal. Editor bebas mengatur
              block Sanity di atas dan bawah shell, sementara section ini tetap
              menjadi lapisan positioning yang dikontrol code.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/90 p-5">
                <div className="text-sm font-medium text-foreground">Kapan diubah</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ubah copy dan struktur section ini saat Anda sudah tahu narasi inti
                  yang wajib stabil untuk page utama ini.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/90 p-5">
                <div className="text-sm font-medium text-foreground">Kapan dibiarkan CMS</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Gunakan block Sanity untuk proof, hero support, CTA, FAQ, dan
                  eksperimen copy yang tidak perlu mengubah shell utama.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-background/90 p-7 shadow-[0_18px_70px_-42px_rgba(0,0,0,0.3)]">
            <div className="space-y-4">
              <div className="text-sm font-medium text-foreground">
                Scaffold next steps
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Setelah scaffold dibuat, biasanya langkah berikutnya adalah
                menyempurnakan middle section ini, lalu membiarkan tim konten
                mengatur block Sanity di atas dan bawahnya.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">Diskusikan kebutuhan</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/test-page-hybrid">Lihat blueprint</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
