import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  groups: [
    {
      name: "general",
      title: "General",
    },
    {
      name: "company",
      title: "Company Info",
    },
    {
      name: "contact",
      title: "Contact",
    },
    {
      name: "social",
      title: "Social Media",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      group: "general",
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      group: "company",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companyTagline",
      title: "Company Tagline",
      type: "string",
      group: "company",
    }),
    defineField({
      name: "companyDescription",
      title: "Company Description",
      type: "text",
      group: "company",
    }),
    defineField({
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
      group: "company",
    }),
    defineField({
      name: "projectsCompleted",
      title: "Projects Completed",
      type: "number",
      group: "company",
    }),
    defineField({
      name: "location",
      title: "Primary Location",
      type: "string",
      group: "company",
    }),
    defineField({
      name: "coverage",
      title: "Coverage Area",
      type: "string",
      group: "company",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Physical Address",
      type: "text",
      group: "contact",
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media Links",
      type: "object",
      group: "social",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
        defineField({
          name: "twitter",
          title: "Twitter",
          type: "url",
        }),
        defineField({
          name: "youtube",
          title: "YouTube",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "techStack",
      title: "Technology Stack",
      type: "array",
      of: [{ type: "string" }],
      group: "company",
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      subtitle: "companyTagline",
    },
  },
});