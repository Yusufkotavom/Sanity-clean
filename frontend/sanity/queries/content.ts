import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    keywords,
    companyName,
    companyTagline,
    companyDescription,
    foundedYear,
    projectsCompleted,
    location,
    coverage,
    phone,
    whatsapp,
    email,
    address,
    socialMedia,
    techStack
  }
`;

export const HOME_CONTENT_QUERY = groq`
  *[_type == "homeContent"][0] {
    _id,
    heroEyebrow,
    heroTitle,
    heroDescription,
    heroPrimaryCta,
    heroSecondaryCta,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    foundedYear,
    projectsCompleted,
    location,
    coverage,
    servicesEyebrow,
    servicesTitle,
    servicesDescription,
    workflowTitle,
    workflowSteps,
    closingTitle,
    closingDescription,
    assurancePoints
  }
`;

export const FAQ_QUERY = groq`
  *[_type == "faq" && isActive == "active"] | order(orderRank) {
    _id,
    question,
    answer,
    category
  }
`;

export const WHY_CHOOSE_REASONS_QUERY = groq`
  *[_type == "whyChooseReason" && isActive == "active"] | order(order asc) {
    _id,
    title,
    description,
    icon,
    order
  }
`;

export const SERVICE_LANES_QUERY = groq`
  *[_type == "serviceLane" && isActive == "active"] | order(order asc) {
    _id,
    key,
    eyebrow,
    title,
    description,
    href,
    bullets,
    order
  }
`;

export const SERVICE_CLUSTERS_QUERY = groq`
  *[_type == "serviceCluster" && isActive == "active"] | order(order asc) {
    _id,
    title,
    description,
    href,
    priceHint,
    bullets,
    order
  }
`;