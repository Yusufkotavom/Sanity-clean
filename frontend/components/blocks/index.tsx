import dynamic from "next/dynamic";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import FadeIn from "@/components/ui/fade-in";

import Hero1 from "@/components/blocks/hero/hero-1";
import Hero2 from "@/components/blocks/hero/hero-2";
import HeroVercel from "@/components/blocks/hero/hero-vercel";
const SectionHeader = dynamic(() => import("@/components/blocks/section-header"));
const SplitRow = dynamic(() => import("@/components/blocks/split/split-row"));
const GridRow = dynamic(() => import("@/components/blocks/grid/grid-row"));
const Carousel1 = dynamic(() => import("@/components/blocks/carousel/carousel-1"));
const Carousel2 = dynamic(() => import("@/components/blocks/carousel/carousel-2"));
const TimelineRow = dynamic(() => import("@/components/blocks/timeline/timeline-row"));
const Cta1 = dynamic(() => import("@/components/blocks/cta/cta-1"));
const WhatsAppCta = dynamic(() => import("@/components/blocks/cta/whatsapp-cta"));
const LogoCloud1 = dynamic(() => import("@/components/blocks/logo-cloud/logo-cloud-1"));
const FAQs = dynamic(() => import("@/components/blocks/faqs"));
const FormNewsletter = dynamic(() => import("@/components/blocks/forms/newsletter"));
const AllPosts = dynamic(() => import("@/components/blocks/all-posts"));
const RichContent = dynamic(() => import("@/components/blocks/rich-content"));
const CompanyInfo = dynamic(() => import("@/components/blocks/seo/company-info"));
const TestimonialsBlock = dynamic(() => import("@/components/blocks/seo/testimonials-block"));
const PricingBlock = dynamic(() => import("@/components/blocks/seo/pricing-block"));
const FeaturesPackageBlock = dynamic(() => import("@/components/blocks/seo/features-package-block"));
const ServiceTypesBlock = dynamic(() => import("@/components/blocks/seo/service-types-block"));
const ProblemSolutionBlock = dynamic(() => import("@/components/blocks/seo/problem-solution-block"));
const QuoteSpotlightBlock = dynamic(() => import("@/components/blocks/seo/quote-spotlight-block"));
const FlexibleBuilder = dynamic(() => import("@/components/blocks/flexible-builder"));
const TabsSection = dynamic(() => import("@/components/blocks/tabs-section"));
const BannerSection = dynamic(() => import("@/components/blocks/banner-section"));

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

export const componentMap: Record<string, React.ComponentType<any>> = {
  "hero-1": Hero1,
  "hero-2": Hero2,
  "hero-vercel": HeroVercel,
  "section-header": SectionHeader,
  "split-row": SplitRow,
  "grid-row": GridRow,
  "carousel-1": Carousel1,
  "carousel-2": Carousel2,
  "timeline-row": TimelineRow,
  "cta-1": Cta1,
  "whatsapp-cta": WhatsAppCta,
  "logo-cloud-1": LogoCloud1,
  faqs: FAQs,
  "form-newsletter": FormNewsletter,
  "all-posts": AllPosts,
  "legacy-rich-content": RichContent,
  "rich-content": RichContent,
  "company-info": CompanyInfo,
  "testimonials-block": TestimonialsBlock,
  "pricing-block": PricingBlock,
  "features-package-block": FeaturesPackageBlock,
  "service-types-block": ServiceTypesBlock,
  "problem-solution-block": ProblemSolutionBlock,
  "quote-spotlight-block": QuoteSpotlightBlock,
  "flexible-builder": FlexibleBuilder,
  "tabs-section": TabsSection,
  "banner-section": BannerSection,
};

export const BLOCK_COMPONENT_TYPES = Object.keys(componentMap);

export default function Blocks({
  blocks,
  pageTitle,
}: {
  blocks: Block[];
  pageTitle?: string | null;
}) {
  return (
    <>
      {blocks?.map((block, index) => {
        const isFirst = index === 0;

        // Handle block preset references — flatten nested blocks
        if ((block as any)._type === "block-preset-ref") {
          const presetBlocks = (block as any).presetBlocks as Block[] | null;
          if (!presetBlocks?.length) return null;
          return presetBlocks.map((nested, nestedIndex) => {
            const isNestedFirst = isFirst && nestedIndex === 0;
            const Component = componentMap[nested._type];
            if (!Component) return <div data-type={nested._type} key={nested._key} />;
            
            const content = <Component {...(nested as any)} pageTitle={pageTitle} />;
            return isNestedFirst ? (
              <div key={nested._key}>{content}</div>
            ) : (
              <FadeIn key={nested._key}>{content}</FadeIn>
            );
          });
        }

        const Component = componentMap[block._type];
        if (!Component) {
          console.warn(
            `No component implemented for block type: ${block._type}`,
          );
          return <div data-type={block._type} key={block._key} />;
        }
        
        const content = <Component {...(block as any)} pageTitle={pageTitle} />;
        return isFirst ? (
          <div key={block._key}>{content}</div>
        ) : (
          <FadeIn key={block._key}>{content}</FadeIn>
        );
      })}
    </>
  );
}
