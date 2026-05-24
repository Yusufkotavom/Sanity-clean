import SectionContainer from "@/components/ui/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import GlassCard from "@/components/ui/glass-card";

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "faqs" }
>;

export default function FAQs({ padding, colorVariant, faqs }: FAQProps) {
  const validFaqs = (faqs || []).filter(
    (faq: any): faq is NonNullable<typeof faq> =>
      Boolean(faq?._id || faq?.question),
  );

  return (
    <SectionContainer color={colorVariant} padding={padding}>
      {validFaqs.length > 0 && (
        <Accordion className="space-y-4" type="multiple">
          {validFaqs.map((faq: any, index: number) => (
            <GlassCard key={faq._id || faq.question || `faq-${index}`} className="p-0">
              <AccordionItem value={`item-${faq._id || faq.question || index}`}>
                <AccordionTrigger className="px-6">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </GlassCard>
          ))}
        </Accordion>
      )}
    </SectionContainer>
  );
}

