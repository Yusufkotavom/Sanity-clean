import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import ReusableSlotSections from "@/components/reusable-slot-sections";
import { fetchSanityReusableSections } from "@/sanity/lib/fetch";

export const revalidate = 604800;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reusableSections = await fetchSanityReusableSections();
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <>
      <ReusableSlotSections sections={reusableSections} slot="beforeHeader" />
      <Header />
      <ReusableSlotSections sections={reusableSections} slot="afterHeader" />
      <main className="ui-shell bg-grid-vercel min-h-[calc(100vh-64px)]">
        <ReusableSlotSections sections={reusableSections} slot="beforeMainContent" />
        {children}
        <ReusableSlotSections sections={reusableSections} slot="afterMainContent" />
      </main>
      <ReusableSlotSections sections={reusableSections} slot="beforeFooter" />
      <Footer />
      <ReusableSlotSections sections={reusableSections} slot="afterFooter" />
      <FloatingWhatsApp />
      {isDraftMode && <SanityLive />}
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  );
}
