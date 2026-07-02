import { stegaClean } from "@/lib/clean";
import SectionContainer from "@/components/ui/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GlassCard from "@/components/ui/glass-card";
import type {   } from "@/sanity.types";

type FAQBlock = {
  _type: "faqs";
  _key: string;
  title?: string;
  description?: string;
  source?: string;
  faqs?: { _id?: string; question?: string; answer?: string }[] | null;
  manualItems?: { _key?: string; question?: string; answer?: string }[] | null;
  blockStyles?: any;
};

export default function FAQs(block: FAQBlock) {
  const {   title, description, source, faqs, manualItems } = block;
  const dataSource = stegaClean(source) || "reference";

  let items: { _id?: string; question?: string; answer?: string }[] = [];

  if (dataSource === "manual") {
    items = (manualItems || []).map((item, i) => ({
      _id: `manual-${i}`,
      question: item.question,
      answer: item.answer,
    }));
  } else {
    items = (faqs || []).filter((faq) => faq?._id || faq?.question);
  }

  return (
    <SectionContainer blockStyles={block.blockStyles}>
      <div className="mx-auto max-w-4xl">
        {title || description ? (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        ) : null}

        {items.length > 0 && (
          <GlassCard className="p-2 md:p-3">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={item._id || item.question || `faq-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        )}
      </div>
    </SectionContainer>
  );
}
