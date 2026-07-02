import { defineField, defineType } from "sanity";
import { Mails } from "lucide-react";
import { STACK_ALIGN } from "../shared/layout-variants";

export default defineType({
  name: "form-newsletter",
  type: "object",
  title: "Form: Newsletter",
  description:
    "A subscription form ideal for collecting email addresses for newsletters and waitlists.",
  icon: Mails,
  initialValue: {
    stackAlign: "left",
    consentText:
      "Dengan berlangganan, Anda setuju menerima update insight digital dan promo layanan. Bisa berhenti kapan saja.",
    buttonText: "Dapatkan Update",
    successMessage: "Terima kasih, email Anda sudah terdaftar.",
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
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
      name: "consentText",
      group: "content",
      type: "text",
    }),
    defineField({
      name: "buttonText",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "successMessage",
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
    prepare() {
      return {
        title: "Newsletter Form",
      };
    },
  },
});
