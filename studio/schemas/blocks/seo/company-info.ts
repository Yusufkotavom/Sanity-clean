import { defineType, defineField } from "sanity";
import { Building2 } from "lucide-react";

export default defineType({
  name: "company-info",
  title: "Company Info",
  type: "object",
  icon: Building2,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Tentang Kotacom",
    description: "Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015",
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
      initialValue: "Tentang Kotacom",
    }),
    defineField({
      name: "description",
      group: "content",
      type: "text",
      rows: 3,
      initialValue: "Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015",
    }),
      defineField({
            name: "blockStyles",
            type: "blockStyles",
            title: "Block Styles",
            
            options: { collapsible: true, collapsed: true }
          })
],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Company Info",
        subtitle: title || "Trust Signals",
      };
    },
  },
});
