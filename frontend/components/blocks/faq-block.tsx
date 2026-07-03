import SectionContainer from "@/components/ui/section-container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type FaqBlock = Extract<Block, { _type: "faq-block" }>;

export default function FaqBlock({ blockStyles, title, description, faqs }: FaqBlock) {
  const items = Array.isArray(faqs) ? faqs : [];
  const hasItems = items.some((item: any) => item?.question || String(item));

  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-4xl">
        {title && <div className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</div>}
        {description && <p className="mx-auto mb-12 text-center text-muted-foreground">{description}</p>}
        {hasItems && (
          <div className="rounded-lg border p-2 md:p-3">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item: any, index: number) => (
                <AccordionItem key={item._key || item.question || `faq-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{String(item?.question || item)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{String(item?.answer || item)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
