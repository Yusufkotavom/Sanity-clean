import { HeroStandard } from "@/components/blocks/hero/hero-standard";
import { GridFeature } from "@/components/blocks/grid/grid-feature";
import { CtaStandard } from "@/components/blocks/cta/cta-standard";

export default function VitPosPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroStandard
        block={{
          _type: "block.hero",
          _key: "hero-vitpos",
          title: "VitPOS - Sistem Kasir Pintar",
          subtitle: "Kelola bisnis Anda dengan mudah dan efisien menggunakan VitPOS. Solusi kasir digital lengkap untuk segala jenis usaha.",
          primaryButton: { text: "Coba Gratis", url: "#" },
          secondaryButton: { text: "Pelajari Lebih Lanjut", url: "#" },
          alignment: "center",
          size: "lg"
        }}
      />
      <GridFeature
        block={{
          _type: "block.grid",
          _key: "features-vitpos",
          title: "Fitur Unggulan VitPOS",
          subtitle: "Semua yang Anda butuhkan untuk mengembangkan bisnis",
          columns: 3,
          items: [
            {
              _key: "f1",
              title: "Manajemen Inventaris",
              description: "Pantau stok barang secara real-time dan dapatkan notifikasi saat stok menipis."
            },
            {
              _key: "f2",
              title: "Laporan Keuangan",
              description: "Analisis penjualan dan keuntungan dengan laporan yang komprehensif dan mudah dipahami."
            },
            {
              _key: "f3",
              title: "Manajemen Pelanggan",
              description: "Bangun loyalitas pelanggan dengan program membership dan diskon khusus."
            }
          ]
        }}
      />
      <CtaStandard
        block={{
          _type: "block.cta",
          _key: "cta-vitpos",
          title: "Siap Meningkatkan Bisnis Anda?",
          subtitle: "Bergabung dengan ribuan pengusaha yang telah menggunakan VitPOS.",
          button: { text: "Daftar Sekarang", url: "#" }
        }}
      />
    </main>
  );
}
