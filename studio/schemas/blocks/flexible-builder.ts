import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "flexible-builder",
  type: "object",
  title: "Flexible Builder",
  description: "Elementor-like row and column builder using Portable Text.",
  icon: LayoutTemplate,
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "layout",
      group: "style",
      type: "string",
      title: "Column Layout",
      options: {
        list: [
          { title: "1 Column (100%)", value: "1-col" },
          { title: "2 Columns (50/50)", value: "2-col-equal" },
          { title: "2 Columns (30/70)", value: "2-col-30-70" },
          { title: "2 Columns (70/30)", value: "2-col-70-30" },
          { title: "3 Columns (33/33/33)", value: "3-col-equal" },
          { title: "4 Columns (25/25/25/25)", value: "4-col-equal" },
        ],
        layout: "radio",
      },
      initialValue: "1-col",
    }),
    defineField({
      name: "columns",
      group: "style",
      type: "array",
      title: "Columns Content",
      description: "Add content for each column. The number of items here should match your chosen layout.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "content",
              type: "block-content",
              title: "Column Content",
            }),
          ],
          preview: {
            select: {
              content: "content",
            },
            prepare(selection) {
              const { content } = selection;
              const block = (content || []).find((b: any) => b._type === "block");
              return {
                title: block
                  ? block.children
                      .filter((child: any) => child._type === "span")
                      .map((span: any) => span.text)
                      .join("")
                  : "Empty Column",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
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
      layout: "layout",
      columns: "columns",
    },
    prepare({ layout, columns }) {
      const colCount = columns ? columns.length : 0;
      return {
        title: "Flexible Builder",
        subtitle: `Layout: ${layout} (${colCount} columns configured)`,
      };
    },
  },
});
