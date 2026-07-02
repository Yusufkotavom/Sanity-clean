import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export default defineType({
  name: "legacy-rich-content",
  title: "Rich Content (Markdown)",
  type: "object",
  icon: FileText,
  initialValue: {
    title: "",
    excerpt: "",
    contentFormat: "markdown",
    contentRaw: "## Judul\n\nTulis konten Markdown di sini.",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "title",
      group: "content",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      group: "content",
      title: "Excerpt",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "contentFormat",
      group: "content",
      title: "Content Format",
      type: "string",
      options: {
        list: [
          { title: "Markdown", value: "markdown" },
          { title: "HTML (Legacy)", value: "html" },
        ],
        layout: "radio",
      },
      initialValue: "markdown",
      hidden: true,
    }),
    defineField({
      name: "contentRaw",
      group: "content",
      title: "Content",
      type: "markdown",
      description: "Tulis konten dalam format Markdown.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      content: "contentRaw",
    },
    prepare({ title, content }) {
      return {
        title: title || "Rich Content",
        subtitle: content
          ? content.substring(0, 60).replace(/[#*_]/g, "") + "..."
          : "Empty",
      };
    },
  },
});
