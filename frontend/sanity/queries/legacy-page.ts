import { groq } from "next-sanity";
import { metaQuery } from "./shared/meta";
import { imageQuery } from "./shared/image";
import { hero1Query } from "./hero/hero-1";
import { hero2Query } from "./hero/hero-2";
import { sectionHeaderQuery } from "./section-header";
import { splitRowQuery } from "./split/split-row";
import { gridRowQuery } from "./grid/grid-row";
import { carousel1Query } from "./carousel/carousel-1";
import { carousel2Query } from "./carousel/carousel-2";
import { timelineQuery } from "./timeline";
import { cta1Query } from "./cta/cta-1";
import { whatsappCtaQuery } from "./cta/whatsapp-cta";
import { logoCloud1Query } from "./logo-cloud/logo-cloud-1";
import { faqsQuery } from "./faqs";
import { formNewsletterQuery } from "./forms/newsletter";
import { allPostsQuery } from "./all-posts";
import { legacyRichContentQuery } from "./legacy/legacy-rich-content";
import { companyInfoQuery } from "./seo/company-info";
import { testimonialsBlockQuery } from "./seo/testimonials-block";
import { pricingBlockQuery } from "./seo/pricing-block";
import { faqBlockQuery } from "./seo/faq-block";
import { benefitsBlockQuery } from "./seo/benefits-block";
import { featuresPackageBlockQuery } from "./seo/features-package-block";
import { serviceTypesBlockQuery } from "./seo/service-types-block";
import { problemSolutionBlockQuery } from "./seo/problem-solution-block";
import { valuePropsBlockQuery } from "./seo/value-props-block";
import { statsHeroBlockQuery } from "./seo/stats-hero-block";
import { eeatBlockQuery } from "./seo/eeat-block";
import { metricsRailBlockQuery } from "./seo/metrics-rail-block";
import { highlightsBlockQuery } from "./seo/highlights-block";
import { reviewsBlockQuery } from "./seo/reviews-block";
import { microBadgesBlockQuery } from "./seo/micro-badges-block";

export const LEGACY_PAGE_OVERRIDE_QUERY = groq`
  *[_type == "legacyPage" && route == $route][0]{
    route,
    templateVariant,
    heroOverride{
      title,
      subtitle,
      eyebrow,
      ctaLabel,
      ctaHref,
      secondaryKeywords,
      image{
        ${imageQuery}
      }
    },
    highlightsOverride,
    faqOverride[]{
      question,
      answer
    },
    sectionOrder,
    customBlocks[]{
      ${hero1Query},
      ${hero2Query},
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
      ${eeatBlockQuery},
      ${metricsRailBlockQuery},
      ${highlightsBlockQuery},
      ${reviewsBlockQuery},
      ${microBadgesBlockQuery},
    },
    ${metaQuery},
  }
`;
