import { defineField, defineType } from "sanity";

export default defineType({
  name: "legacy-rich-content",
  title: "Legacy Rich Content",
  type: "object",
  initialValue: {
    title: "Konten Legacy",
    excerpt: "Ringkasan singkat untuk konten legacy ini.",
    contentFormat: "markdown",
    contentRaw: "Tulis konten legacy di sini.",
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "contentFormat",
      title: "Content Format",
      type: "string",
      options: {
        list: [
          { title: "Markdown", value: "markdown" },
          { title: "HTML", value: "html" },
        ],
        layout: "radio",
      },
      initialValue: "markdown",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentRaw",
      title: "Raw Content",
      type: "text",
      rows: 18,
      validation: (Rule) => Rule.required(),
      description:
        "Isi konten mentah dalam format Markdown atau HTML sesuai pilihan di atas.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      format: "contentFormat",
    },
    prepare(selection) {
      return {
        title: selection.title || "Legacy Rich Content",
        subtitle: selection.format ? `Format: ${selection.format}` : undefined,
      };
    },
  },
});
