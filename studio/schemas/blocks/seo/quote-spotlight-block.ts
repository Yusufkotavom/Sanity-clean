import { defineField, defineType } from "sanity";
import { Quote } from "lucide-react";

export default defineType({
  name: "quote-spotlight-block",
  title: "Quote Spotlight",
  type: "object",
  icon: Quote,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      initialValue: "Customer story",
    }),
    defineField({
      name: "quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
    }),
    defineField({
      name: "highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Visual highlight chips shown beside the quote",
    }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: { title: "author", subtitle: "quote" },
    prepare({ title, subtitle }) {
      return { title: "Quote Spotlight", subtitle: `${title}: ${subtitle?.slice(0, 50)}` };
    },
  },
});
