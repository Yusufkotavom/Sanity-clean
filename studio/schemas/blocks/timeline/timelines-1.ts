import { defineField, defineType } from "sanity";

export default defineType({
  name: "timelines-1",
  type: "object",
  title: "Timelines 1",
  initialValue: {
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
            text: "Analisis kebutuhan bisnis, audit proses eksisting, dan prioritas fitur untuk fase implementasi.",
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
      name: "title",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "tagLine",
      group: "content",
      title: "Tag Line",
      description:
        "A short tag line to display under the title, e.g. date, location, job title, etc.",
      type: "string",
    }),
    defineField({
      name: "body",
      group: "content",
      title: "Body",
      type: "block-content",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
