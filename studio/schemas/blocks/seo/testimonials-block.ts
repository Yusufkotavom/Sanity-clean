import { defineType, defineField } from "sanity";
import { MessageSquareQuote } from "lucide-react";

export default defineType({
  name: "testimonials-block",
  title: "Testimonials",
  type: "object",
  icon: MessageSquareQuote,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    source: "global",
    title: "Apa Kata Klien Kami",
    description: "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "title",
      group: "content",
      type: "string",
      initialValue: "Apa Kata Klien Kami",
    }),
    defineField({
      name: "description",
      group: "content",
      type: "text",
      rows: 2,
      initialValue: "Testimoni nyata dari klien yang telah merasakan hasil kerja sama dengan Kotacom",
    }),
    defineField({
      name: "source",
      group: "content",
      type: "string",
      title: "Data Source",
      options: {
        list: [
          { title: "Global (SEO Settings)", value: "global" },
          { title: "Manual Input", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "global",
    }),
    defineField({
      name: "category",
      group: "content",
      type: "string",
      title: "Filter by Category",
      description: "Only applies when source is Global. Leave empty to show all",
      options: {
        list: [
          { title: "All", value: "" },
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "Printing", value: "printing" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => parent?.source !== "global",
    }),
    defineField({
      name: "manualItems",
      group: "content",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reviewItem" }],
      hidden: ({ parent }) => parent?.source !== "manual",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.source === "manual" && (!value || value.length === 0)) {
            return "Add at least one testimonial when source is Manual";
          }
          return true;
        }),
    }),
      defineField({
            name: "blockStyles",
      group: "style",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      title: "title",
      source: "source",
      category: "category",
    },
    prepare({ title, source, category }) {
      const subtitle = source === "manual" ? "Manual Input" : category ? `Global - ${category}` : "Global - All";
      return { title: "Testimonials", subtitle: `${title} (${subtitle})` };
    },
  },
});
