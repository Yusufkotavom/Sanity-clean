import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "split-row",
  type: "object",
  title: "Split Row",
  description:
    "Split Row: Customizable split row with multiple columns variants",
  icon: SquareSplitHorizontal,
  initialValue: {
    colorVariant: "background",
    noGap: false,
    splitColumns: [
      {
        _key: "column-1",
        _type: "split-content",
        tagLine: "Keunggulan",
        title: "Satu partner untuk eksekusi teknis end-to-end",
        body: [
          {
            _key: "body-1",
            _type: "block",
            style: "normal",
            markDefs: [],
            children: [
              {
                _key: "body-1-span-1",
                _type: "span",
                marks: [],
                text: "Dari kebutuhan website, aplikasi, IT support, hingga desain dan percetakan, semuanya bisa dikelola dalam satu alur kerja.",
              },
            ],
          },
        ],
        link: {
          _type: "link",
          isExternal: false,
          title: "Diskusikan Kebutuhan",
          target: false,
          buttonVariant: "default",
        },
      },
      {
        _key: "column-2",
        _type: "split-info-list",
        list: [
          {
            _key: "info-1",
            _type: "split-info",
            title: "One-Stop Solution",
            body: [
              {
                _key: "body-1",
                _type: "block",
                style: "normal",
                markDefs: [],
                children: [
                  {
                    _key: "body-1-span-1",
                    _type: "span",
                    marks: [],
                    text: "Semua kebutuhan digital dan IT dalam satu vendor yang terkoordinasi.",
                  },
                ],
              },
            ],
            tags: ["Efisien", "Terintegrasi"],
          },
          {
            _key: "info-2",
            _type: "split-info",
            title: "Fast Delivery",
            body: [
              {
                _key: "body-1",
                _type: "block",
                style: "normal",
                markDefs: [],
                children: [
                  {
                    _key: "body-1-span-1",
                    _type: "span",
                    marks: [],
                    text: "Timeline implementasi jelas, progress transparan, dan komunikasi cepat.",
                  },
                ],
              },
            ],
            tags: ["Timeline", "Execution"],
          },
        ],
      },
    ],
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "noGap",
      group: "content",
      type: "boolean",
      description: "Remove gap between columns",
      initialValue: false,
    }),
    defineField({
      name: "splitColumns",
      group: "content",
      type: "array",
      of: [
        { type: "split-content" },
        { type: "split-cards-list" },
        { type: "split-image" },
        { type: "split-info-list" },
      ],
      validation: (rule) => rule.max(2),
      options: {
        insertMenu: {
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
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
      title0: "splitColumns.0.title",
      title1: "splitColumns.1.title",
    },
    prepare({ title0, title1 }) {
      return {
        title: "Split Row",
        subtitle: title0 || title1 || "No Title",
      };
    },
  },
});
