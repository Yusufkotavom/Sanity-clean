import SectionContainer from "@/components/ui/section-container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  processTitle?: string | null;
  processSteps?: string[] | null;
  faqTitle?: string | null;
  faqs?: Array<{ _key?: string; question?: string; answer?: string }> | null;
};

export default function ProcessFaqBlock({ padding, colorVariant, processTitle, processSteps, faqTitle, faqs }: Props) {
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div className="grid gap-8 md:grid-cols-2">
        {processSteps?.length ? (
          <div>
            <h2 className="mb-4 text-xl font-bold">{processTitle || "Proses"}</h2>
            <ol className="space-y-3">
              {processSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">{i + 1}</span>
                  <p className="pt-1 text-sm">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {faqs?.length ? (
          <div>
            <h2 className="mb-4 text-xl font-bold">{faqTitle || "FAQ"}</h2>
            <Accordion type="single" collapsible className="rounded-xl border border-border/40 px-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq._key || i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
