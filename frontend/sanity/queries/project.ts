import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";
import { linkQuery } from "./shared/link";
import { blocksQuery } from "./shared/blocks";

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  title,
  slug,
  excerpt,
  body[]{
    ${bodyQuery}
  },
  image{
    ${imageQuery}
  },
  clientName,
  industry,
  completionYear,
  projectType,
  repositoryUrl,
  previewUrl,
  projectUrl,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  },
  ${blocksQuery},
  _createdAt,
  _updatedAt,
  ${metaQuery},
}`;

export const PROJECTS_QUERY = groq`*[_type == "project" && defined(slug)] | order(featured desc, _createdAt desc){
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  clientName,
  industry,
  completionYear,
  projectType,
  repositoryUrl,
  previewUrl,
  projectUrl,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;

export const PROJECTS_HOME_QUERY = groq`*[_type == "project" && defined(slug)] | order(featured desc, _createdAt desc) [0...3]{
  title,
  slug,
  excerpt,
  image{
    ${imageQuery}
  },
  clientName,
  industry,
  completionYear,
  projectType,
  repositoryUrl,
  previewUrl,
  projectUrl,
  featured,
  categories[]->{
    _id,
    title,
    slug
  },
  cta{
    ${linkQuery}
  }
}`;

export const PROJECTS_SLUGS_QUERY = groq`*[_type == "project" && defined(slug)]{slug}`;
