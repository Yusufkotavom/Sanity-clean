// documents
import page from "./schemas/documents/page";
import post from "./schemas/documents/post";
import product from "./schemas/documents/product";
import service from "./schemas/documents/service";
import serviceType from "./schemas/documents/service-type";
import project from "./schemas/documents/project";
import author from "./schemas/documents/author";
import category from "./schemas/documents/category";
import faq from "./schemas/documents/faq";
import testimonial from "./schemas/documents/testimonial";
import navigation from "./schemas/documents/navigation";
import settings from "./schemas/documents/settings";
import themeSettings from "./schemas/documents/theme-settings";
import seoSettings from "./schemas/documents/seo-settings";
import ogSettings from "./schemas/documents/og-settings";
import pageTemplate from "./schemas/documents/page-template";
import pageLocation from "./schemas/documents/page-location";
import serviceLocation from "./schemas/documents/service-location";
import location from "./schemas/documents/location";
import redirect from "./schemas/documents/redirect";
import reusableSection from "./schemas/documents/reusable-section";
import seoOpsSettings from "./schemas/documents/seo-ops-settings";
import legacyPage from "./schemas/documents/legacy-page";
import generatorTemplate from "./schemas/documents/generator-template";
import generatorProgram from "./schemas/documents/generator-program";
import generatorDataset from "./schemas/documents/generator-dataset";
import siteSettings from "./schemas/documents/site-settings";
import homeContent from "./schemas/documents/home-content";
import whyChooseReason from "./schemas/documents/why-choose-reason";
import serviceLane from "./schemas/documents/service-lane";
import serviceCluster from "./schemas/documents/service-cluster";

// Schema UI shared objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import navigationLinkChild from "./schemas/blocks/shared/navigation-link-child";
import { colorVariant } from "./schemas/blocks/shared/color-variant";
import { buttonVariant } from "./schemas/blocks/shared/button-variant";
import { navigationIcon } from "./schemas/blocks/shared/navigation-icon";
import { uiIcon } from "./schemas/blocks/shared/ui-icon";
import sectionPadding from "./schemas/blocks/shared/section-padding";
import reviewItem from "./schemas/blocks/shared/review-item";
import aggregateRatingObj from "./schemas/blocks/shared/aggregate-rating";
import affiliateItem from "./schemas/blocks/shared/affiliate-item";
import templateCtaLink from "./schemas/objects/template-cta-link";
import templateFaq from "./schemas/objects/template-faq";
import templateServiceType from "./schemas/objects/template-service-type";
import templatePricingPlan from "./schemas/objects/template-pricing-plan";
import templateFeature from "./schemas/objects/template-feature";
import templateEeatPoint from "./schemas/objects/template-eeat-point";
import templateProofItem from "./schemas/objects/template-proof-item";
import templateTestimonial from "./schemas/objects/template-testimonial";
import templateLongGuide from "./schemas/objects/template-long-guide";
import templateContentVariant from "./schemas/objects/template-content-variant";
import templateRewriteCopy from "./schemas/objects/template-rewrite-copy";
import templateSourcePolicy from "./schemas/objects/template-source-policy";
import pricingPackage from "./schemas/objects/pricingPackage";
import faqItem from "./schemas/objects/faqItem";
import generatorTokenDefinition from "./schemas/objects/generator-token-definition";
import generatorKeywordSet from "./schemas/objects/generator-keyword-set";
import generatorRow from "./schemas/objects/generator-row";
import generatorPageMeta from "./schemas/objects/generator-page-meta";
// Schema UI objects
import hero1 from "./schemas/blocks/hero/hero-1";
import hero2 from "./schemas/blocks/hero/hero-2";
import heroVercel from "./schemas/blocks/hero/hero-vercel";
import heroFeatureCard from "./schemas/blocks/hero/hero-feature-card";
import sectionHeader from "./schemas/blocks/section-header";
import splitRow from "./schemas/blocks/split/split-row";
import splitContent from "./schemas/blocks/split/split-content";
import splitCardsList from "./schemas/blocks/split/split-cards-list";
import splitCard from "./schemas/blocks/split/split-card";
import splitImage from "./schemas/blocks/split/split-image";
import splitInfoList from "./schemas/blocks/split/split-info-list";
import splitInfo from "./schemas/blocks/split/split-info";
import gridCard from "./schemas/blocks/grid/grid-card";
import pricingCard from "./schemas/blocks/grid/pricing-card";
import gridPost from "./schemas/blocks/grid/grid-post";
import gridRow from "./schemas/blocks/grid/grid-row";
import carousel1 from "./schemas/blocks/carousel/carousel-1";
import carousel2 from "./schemas/blocks/carousel/carousel-2";
import timelineRow from "./schemas/blocks/timeline/timeline-row";
import timelinesOne from "./schemas/blocks/timeline/timelines-1";
import cta1 from "./schemas/blocks/cta/cta-1";
import whatsappCta from "./schemas/blocks/cta/whatsapp-cta";
import logoCloud1 from "./schemas/blocks/logo-cloud/logo-cloud-1";
import faqs from "./schemas/blocks/faqs";
import newsletter from "./schemas/blocks/forms/newsletter";
import allPosts from "./schemas/blocks/all-posts";
import legacyRichContent from "./schemas/blocks/legacy/legacy-rich-content";
import companyInfo from "./schemas/blocks/seo/company-info";
import faqBlock from "./schemas/blocks/seo/faq-block";
import testimonialsBlock from "./schemas/blocks/seo/testimonials-block";
import pricingBlock from "./schemas/blocks/seo/pricing-block";
import eeatBlock from "./schemas/blocks/seo/eeat-block";
import metricsRailBlock from "./schemas/blocks/seo/metrics-rail-block";
import highlightsBlock from "./schemas/blocks/seo/highlights-block";
import reviewsBlock from "./schemas/blocks/seo/reviews-block";
import quoteSpotlightBlock from "./schemas/blocks/seo/quote-spotlight-block";
import microBadgesBlock from "./schemas/blocks/seo/micro-badges-block";
import relatedLinksBlock from "./schemas/blocks/seo/related-links-block";
import processFaqBlock from "./schemas/blocks/seo/process-faq-block";
import featuresPackageBlock from "./schemas/blocks/seo/features-package-block";
import serviceTypesBlock from "./schemas/blocks/seo/service-types-block";
import problemSolutionBlock from "./schemas/blocks/seo/problem-solution-block";
import valuePropsBlock from "./schemas/blocks/seo/value-props-block";
import statsHeroBlock from "./schemas/blocks/seo/stats-hero-block";

export const schemaTypes = [
  // documents
  page,
  post,
  product,
  service,
  serviceType,
  project,
  author,
  category,
  faq,
  testimonial,
  navigation,
  settings,
  themeSettings,
  seoSettings,
  ogSettings,
  pageTemplate,
  pageLocation,
  serviceLocation,
  location,
  seoOpsSettings,
  redirect,
  reusableSection,
  legacyPage,
  generatorTemplate,
  generatorProgram,
  generatorDataset,
  siteSettings,
  homeContent,
  whyChooseReason,
  serviceLane,
  serviceCluster,
  // shared objects
  blockContent,
  link,
  navigationLinkChild,
  colorVariant,
  buttonVariant,
  navigationIcon,
  uiIcon as any,
  sectionPadding,
  reviewItem,
  aggregateRatingObj,
  affiliateItem,
  templateCtaLink,
  templateFaq,
  templateServiceType,
  templatePricingPlan,
  templateFeature,
  templateEeatPoint,
  templateProofItem,
  templateTestimonial,
  templateLongGuide,
  templateContentVariant,
  templateRewriteCopy,
  templateSourcePolicy,
  pricingPackage,
  faqItem,
  generatorTokenDefinition,
  generatorKeywordSet,
  generatorRow,
  generatorPageMeta,
  // blocks
  hero1,
  hero2,
  heroVercel,
  heroFeatureCard,
  sectionHeader,
  splitRow,
  splitContent,
  splitCardsList,
  splitCard,
  splitImage,
  splitInfoList,
  splitInfo,
  gridCard,
  pricingCard,
  gridPost,
  gridRow,
  carousel1,
  carousel2,
  timelineRow,
  timelinesOne,
  cta1,
  whatsappCta,
  logoCloud1,
  faqs,
  newsletter,
  allPosts,
  legacyRichContent,
  companyInfo,
  faqBlock,
  testimonialsBlock,
  pricingBlock,
  featuresPackageBlock,
  serviceTypesBlock,
  problemSolutionBlock,
  valuePropsBlock,
  statsHeroBlock,
  eeatBlock,
  metricsRailBlock,
  highlightsBlock,
  reviewsBlock,
  quoteSpotlightBlock,
  microBadgesBlock,
  relatedLinksBlock,
  processFaqBlock,
];
