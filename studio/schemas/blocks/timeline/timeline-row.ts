import { defineType, defineField } from "sanity";
import { ArrowDownNarrowWide } from "lucide-react";

export default defineType({
  name: "timeline-row",
  type: "object",
  title: "Timeline Row",
  description: "Row of Timeline Sections",
  icon: ArrowDownNarrowWide,
  initialValue: {
    colorVariant: "background",
    timelines: [
      {
        _key: "timeline-1",
        _type: "timelines-1",
        title: "Discovery & Audit",
        tagLine: "Minggu 1",
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
                text: "Sesi kickoff, pemetaan kebutuhan, dan validasi target bisnis.",
              },
            ],
          },
        ],
      },
      {
        _key: "timeline-2",
        _type: "timelines-1",
        title: "Implementation",
        tagLine: "Minggu 2-4",
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
                text: "Pengerjaan fitur prioritas, review berkala, dan QA bertahap.",
              },
            ],
          },
        ],
      },
      {
        _key: "timeline-3",
        _type: "timelines-1",
        title: "Launch & Support",
        tagLine: "Minggu 5+",
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
                text: "Go-live, monitoring performa, dan dukungan operasional pasca rilis.",
              },
            ],
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
      name: "timelines",
      group: "content",
      type: "array",
      of: [{ type: "timelines-1" }],
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
      subtitle: "timelines.0.title",
    },
    prepare({ subtitle }) {
      return {
        title: "Timelines Row",
        subtitle,
      };
    },
  },
});
