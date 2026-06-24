import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigation-link-child",
  type: "object",
  title: "Navigation Sub Link",
  initialValue: {
    isExternal: true,
    title: "Submenu Link",
    href: "https://example.com",
    target: false,
  },

  fields: [
    defineField({
      name: "isExternal",
      type: "boolean",
      title: "Is External",
      initialValue: false,
    }),
    defineField({
      name: "internalLink",
      type: "reference",
      title: "Internal Link",
      to: [
        { type: "page" },
        { type: "post" },
        { type: "category" },
        { type: "product" },
        { type: "service" },
        { type: "project" },
      ],
      hidden: ({ parent }) => parent?.isExternal,
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Short supporting text for desktop dropdown panels.",
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional small label such as New or Beta.",
    }),
    defineField({
      name: "group",
      title: "Group / Section",
      type: "string",
      description:
        "Optional section label for desktop mega menu columns (example: Products, Resources).",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "navigation-icon",
      description:
        "Legacy curated icon. Keep for older nav items, but prefer UI Icon for Lucide and Simple Icons.",
      hidden: ({ parent }) => Boolean(parent?.uiIcon?.provider || parent?.uiIcon?.name),
    }),
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description:
        "Preferred reusable icon picker for submenu items. Supports Lucide and Simple Icons.",
      hidden: ({ parent }) => Boolean(parent?.icon),
    }),
    defineField({
      name: "href",
      title: "href",
      type: "url",
      hidden: ({ parent }) => !parent?.isExternal,
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "target",
      type: "boolean",
      title: "Open in new tab",
      initialValue: false,
      hidden: ({ parent }) => !parent?.isExternal,
    }),
  ],
});
