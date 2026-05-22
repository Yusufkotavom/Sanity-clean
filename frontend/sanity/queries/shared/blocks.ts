import { hero1Query } from "../hero/hero-1";
import { hero2Query } from "../hero/hero-2";
import { heroVercelQuery } from "../hero/hero-vercel";
import { sectionHeaderQuery } from "../section-header";
import { splitRowQuery } from "../split/split-row";
import { gridRowQuery } from "../grid/grid-row";
import { carousel1Query } from "../carousel/carousel-1";
import { carousel2Query } from "../carousel/carousel-2";
import { timelineQuery } from "../timeline";
import { cta1Query } from "../cta/cta-1";
import { whatsappCtaQuery } from "../cta/whatsapp-cta";
import { logoCloud1Query } from "../logo-cloud/logo-cloud-1";
import { faqsQuery } from "../faqs";
import { formNewsletterQuery } from "../forms/newsletter";
import { allPostsQuery } from "../all-posts";
import { legacyRichContentQuery } from "../legacy/legacy-rich-content";
import { companyInfoQuery } from "../seo/company-info";
import { testimonialsBlockQuery } from "../seo/testimonials-block";
import { pricingBlockQuery } from "../seo/pricing-block";
import { faqBlockQuery } from "../seo/faq-block";
import { benefitsBlockQuery } from "../seo/benefits-block";
import { featuresPackageBlockQuery } from "../seo/features-package-block";
import { serviceTypesBlockQuery } from "../seo/service-types-block";
import { problemSolutionBlockQuery } from "../seo/problem-solution-block";
import { valuePropsBlockQuery } from "../seo/value-props-block";
import { statsHeroBlockQuery } from "../seo/stats-hero-block";

/**
 * Shared GROQ projection for blocks[].
 * Used across page, post, service, and project queries.
 */
export const blocksQuery = `
  blocks[]{
    _type,
    _key,
    ${hero1Query},
    ${hero2Query},
    ${heroVercelQuery},
    ${sectionHeaderQuery},
    ${splitRowQuery},
    ${gridRowQuery},
    ${carousel1Query},
    ${carousel2Query},
    ${timelineQuery},
    ${cta1Query},
    ${whatsappCtaQuery},
    ${logoCloud1Query},
    ${faqsQuery},
    ${formNewsletterQuery},
    ${allPostsQuery},
    ${legacyRichContentQuery},
    ${companyInfoQuery},
    ${testimonialsBlockQuery},
    ${pricingBlockQuery},
    ${faqBlockQuery},
    ${benefitsBlockQuery},
    ${featuresPackageBlockQuery},
    ${serviceTypesBlockQuery},
    ${problemSolutionBlockQuery},
    ${valuePropsBlockQuery},
    ${statsHeroBlockQuery},
  }
`;
