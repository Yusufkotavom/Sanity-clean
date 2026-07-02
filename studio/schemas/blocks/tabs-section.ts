import { defineField, defineType } from "sanity";
import { Layers } from "lucide-react";

export default defineType({
  name: "tabs-section",
  title: "Tabs Section",
  type: "object",
  icon: Layers,
  description: "A section with tabs to switch between different grid rows",
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
  },
  fields: [
    defineField({
      name: "tabs",
      type: "array",
      title: "Tab Items",
      description: "Add tab items, each containing a label and a grid layout",
      of: [
        {
          type: "object",
          name: "tabItem",
          title: "Tab Item",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Tab Label",
              description: "The text shown on the tab button (e.g., 'Web Development')",
              validation: (Rule) => Rule.required().error("Tab Label is required"),
            }),
            defineField({
              name: "grid",
              type: "grid-row",
              title: "Grid Content",
              description: "Configure the grid structure and cards shown in this tab",
              validation: (Rule) => Rule.required().error("Grid Content is required"),
            }),
          ],
          preview: {
            select: {
              title: "label",
              gridColumns: "grid.gridColumns",
              columnsCount: "grid.columns",
            },
            prepare({ title, gridColumns, columnsCount }) {
              const count = Array.isArray(columnsCount) ? columnsCount.length : 0;
              return {
                title: title || "Untitled Tab",
                subtitle: `Grid: ${gridColumns || "default"} (${count} items)`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error("At least one tab is required"),
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
      tabs: "tabs",
    },
    prepare({ tabs }) {
      const tabList = Array.isArray(tabs) ? tabs.map((t: any) => t.label).filter(Boolean).join(", ") : "";
      return {
        title: "Tabs Section",
        subtitle: tabList ? `Tabs: ${tabList}` : "No tabs configured",
      };
    },
  },
});
