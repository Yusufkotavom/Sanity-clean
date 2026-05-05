import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionIntro, SectionShell } from "@/components/ui/section-shell";
import { fetchFAQs } from "@/sanity/lib/content";

export default async function HomeFAQ() {
  const faqs = await fetchFAQs();

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <SectionShell id="faq">
      <SectionIntro
        eyebrow="Pertanyaan yang Sering Diajukan"
        title="Ada pertanyaan? Kami punya jawabannya"
        description="Temukan jawaban untuk pertanyaan umum tentang layanan kami. Jika pertanyaan Anda belum terjawab, jangan ragu untuk menghubungi kami."
      />
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq: any, index: number) => (
            <AccordionItem key={faq._id} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq: any) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }),
        }}
      />
    </SectionShell>
  );
}
