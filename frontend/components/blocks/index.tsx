import dynamic from "next/dynamic";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

const Hero1 = dynamic(() => import("@/components/blocks/hero/hero-1"));
const Hero2 = dynamic(() => import("@/components/blocks/hero/hero-2"));
const HeroVercel = dynamic(() => import("@/components/blocks/hero/hero-vercel"));
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
const FaqBlock = dynamic(() => import("@/components/blocks/seo/faq-block"));
const FeaturesPackageBlock = dynamic(() => import("@/components/blocks/seo/features-package-block"));
const ServiceTypesBlock = dynamic(() => import("@/components/blocks/seo/service-types-block"));
const ProblemSolutionBlock = dynamic(() => import("@/components/blocks/seo/problem-solution-block"));
const ValuePropsBlock = dynamic(() => import("@/components/blocks/seo/value-props-block"));
const StatsHeroBlock = dynamic(() => import("@/components/blocks/seo/stats-hero-block"));

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

const componentMap: Record<string, React.ComponentType<any>> = {
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
  "faq-block": FaqBlock,
  "features-package-block": FeaturesPackageBlock,
  "service-types-block": ServiceTypesBlock,
  "problem-solution-block": ProblemSolutionBlock,
  "value-props-block": ValuePropsBlock,
  "stats-hero-block": StatsHeroBlock,
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
      {blocks?.map((block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for development/debugging of new component types
          console.warn(
            `No component implemented for block type: ${block._type}`,
          );
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...(block as any)} key={block._key} pageTitle={pageTitle} />;
      })}
    </>
  );
}
