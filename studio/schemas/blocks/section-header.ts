import { defineField, defineType } from "sanity";
import { LetterText } from "lucide-react";
import { STACK_ALIGN, SECTION_WIDTH } from "./shared/layout-variants";

export default defineType({
  name: "section-header",
  type: "object",
  title: "Section Header",
  description: "A section header with a tag line, title, and description",
  icon: LetterText,
  initialValue: {
    colorVariant: "background",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine: "Mengapa Memilih Kami",
    title: "Solusi praktis untuk kebutuhan IT dan digital",
    description:
      "Tim kami membantu dari strategi sampai eksekusi agar bisnis Anda tetap fokus pada pertumbuhan, bukan masalah teknis.",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "sectionWidth",
      group: "style",
      type: "string",
      title: "Section Width",
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "stackAlign",
      group: "style",
      type: "string",
      title: "Stack Layout Alignment",
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "tagLine",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "title",
      group: "content",
      type: "string",
      description: "Optional custom title override. Leave empty to use the page title in frontend.",
    }),
    defineField({
      name: "description",
      group: "content",
      type: "text",
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
        title: "Section Header",
        subtitle: title,
      };
    },
  },
});
