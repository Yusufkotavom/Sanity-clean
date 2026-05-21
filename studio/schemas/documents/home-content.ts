import { defineType, defineField } from "sanity";
import { Home } from "lucide-react";

export default defineType({
  name: "homeContent",
  title: "Home Page Content",
  type: "document",
  icon: Home,
  groups: [
    {
      name: "hero",
      title: "Hero Section",
    },
    {
      name: "stats",
      title: "Stats Bar",
    },
    {
      name: "services",
      title: "Services",
    },
    {
      name: "workflow",
      title: "Workflow",
    },
    {
      name: "closing",
      title: "Closing Section",
    },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "text",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      group: "hero",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Primary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Secondary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: {
        hotspot: true,
      },
    }),

    // Stats Bar
    defineField({
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
      group: "stats",
    }),
    defineField({
      name: "projectsCompleted",
      title: "Projects Completed",
      type: "number",
      group: "stats",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "stats",
    }),
    defineField({
      name: "coverage",
      title: "Coverage",
      type: "string",
      group: "stats",
    }),

    // Services Section
    defineField({
      name: "servicesEyebrow",
      title: "Services Eyebrow",
      type: "string",
      group: "services",
    }),
    defineField({
      name: "servicesTitle",
      title: "Services Title",
      type: "text",
      group: "services",
    }),
    defineField({
      name: "servicesDescription",
      title: "Services Description",
      type: "text",
      group: "services",
    }),

    // Workflow
    defineField({
      name: "workflowTitle",
      title: "Workflow Title",
      type: "string",
      group: "workflow",
    }),
    defineField({
      name: "workflowSteps",
      title: "Workflow Steps",
      type: "array",
      group: "workflow",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Step Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Step Description",
              type: "text",
            }),
          ],
        },
      ],
    }),

    // Closing Section
    defineField({
      name: "closingTitle",
      title: "Closing Title",
      type: "text",
      group: "closing",
    }),
    defineField({
      name: "closingDescription",
      title: "Closing Description",
      type: "text",
      group: "closing",
    }),
    defineField({
      name: "assurancePoints",
      title: "Assurance Points",
      type: "array",
      group: "closing",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "text",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
    },
    prepare({ title }) {
      return {
        title: "Home Page Content",
        subtitle: title,
      };
    },
  },
});