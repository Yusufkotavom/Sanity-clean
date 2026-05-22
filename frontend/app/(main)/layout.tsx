import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import DraftModeTools from "@/components/draft-mode-tools";
import ReusableSlotClient from "@/components/reusable-slot-client";
import { fetchSanityReusableSections } from "@/sanity/lib/fetch";

export const revalidate = 604800;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reusableSections = await fetchSanityReusableSections();

  return (
    <>
      <ReusableSlotClient sections={reusableSections} slot="beforeHeader" />
      <Header />
      <ReusableSlotClient sections={reusableSections} slot="afterHeader" />
      <main className="ui-shell bg-grid-vercel min-h-[calc(100vh-64px)]">
        <ReusableSlotClient sections={reusableSections} slot="beforeMainContent" />
        {children}
        <ReusableSlotClient sections={reusableSections} slot="afterMainContent" />
      </main>
      <ReusableSlotClient sections={reusableSections} slot="beforeFooter" />
      <Footer />
      <ReusableSlotClient sections={reusableSections} slot="afterFooter" />
      <FloatingWhatsApp />
      <Suspense fallback={null}>
        <DraftModeTools />
      </Suspense>
    </>
  );
}
