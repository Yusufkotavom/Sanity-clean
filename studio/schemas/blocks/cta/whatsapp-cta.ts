import { defineField, defineType } from "sanity";
import { MessageCircleMore } from "lucide-react";
import { STACK_ALIGN, SECTION_WIDTH } from "../shared/layout-variants";

export default defineType({
  name: "whatsapp-cta",
  title: "WhatsApp CTA",
  type: "object",
  icon: MessageCircleMore,
  initialValue: {
    colorVariant: "primary",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine: "WhatsApp CTA",
    title: "Butuh jawaban cepat? Chat tim kami via WhatsApp",
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
            text: "CTA utama block ini otomatis mengikuti pengaturan Floating WhatsApp di Settings, jadi nomor, pesan awal, label CTA, dan source context tetap sinkron.",
          },
        ],
      },
    ],
    secondaryLink: {
      _type: "link",
      isExternal: false,
      title: "Lihat Semua Layanan",
      target: false,
      buttonVariant: "outline",
    },
  },
  groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
        defineField({
          name: "tagLine",
          type: "string",
          title: "Tagline",
          
        }),
        defineField({
          name: "uiIcon",
          title: "Icon",
          type: "ui-icon",
          
        }),
        defineField({
          name: "title",
          type: "string",
          title: "Title",
          
        }),
        defineField({
          name: "body",
          type: "block-content",
          
        }),
        defineField({
          name: "secondaryLink",
          title: "Secondary Link",
          type: "link",
          
        }),
        defineField({
          name: "sectionWidth",
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
          type: "string",
          title: "Alignment",
          
          options: {
            list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
            layout: "radio",
          },
          initialValue: "left",
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
        title: "WhatsApp CTA",
        subtitle: title,
      };
    },
  },
});
