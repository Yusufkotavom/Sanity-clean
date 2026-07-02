import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";

export default defineType({
  name: "split-cards-list",
  type: "object",
  icon: TextQuote,
  title: "Split Cards List",
  description:
    "Column with list of cards. Each card has a tag line, title and content body.",
  initialValue: {
    list: [
      {
        _key: "card-1",
        _type: "split-card",
        tagLine: "24/7 Support",
        title: "Dukungan teknis yang responsif",
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
                text: "Tim support membantu troubleshooting harian agar operasional tetap stabil.",
              },
            ],
          },
        ],
      },
      {
        _key: "card-2",
        _type: "split-card",
        tagLine: "Scalable",
        title: "Infrastruktur siap berkembang",
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
                text: "Arsitektur sistem dirancang untuk pertumbuhan traffic, data, dan kebutuhan tim.",
              },
            ],
          },
        ],
      },
      {
        _key: "card-3",
        _type: "split-card",
        tagLine: "Business-first",
        title: "Fokus pada hasil bisnis",
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
                text: "Setiap solusi diprioritaskan untuk efisiensi proses dan peningkatan konversi.",
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
      name: "list",
      group: "content",
      type: "array",
      of: [{ type: "split-card" }],
    }),
  ],
  preview: {
    select: {
      title: "list.0.title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
