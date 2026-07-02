import { defineField, defineType } from "sanity";
import { WalletCards } from "lucide-react";

export default defineType({
  name: "pricing-card",
  type: "object",
  icon: WalletCards,
  initialValue: {
    title: "Website Starter",
    tagLine: "Paling cocok untuk UMKM",
    price: {
      value: 850000,
      period: "/project",
    },
    list: [
      "Desain responsif",
      "Setup domain & hosting",
      "Optimasi SEO dasar",
      "Training penggunaan",
    ],
    excerpt:
      "Paket praktis untuk memulai kehadiran digital bisnis Anda dengan timeline yang cepat.",
    link: {
      _type: "link",
      isExternal: false,
      title: "Diskusikan Paket",
      target: false,
      buttonVariant: "default",
    },
  },
    groups: [
    { name: "content", title: "Content" },
    { name: "style", title: "Style & Layout" },
  ],
  fields: [
    defineField({
      name: "uiIcon",
      group: "content",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown in the pricing card heading.",
    }),
    defineField({
      name: "title",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "tagLine",
      group: "content",
      type: "string",
    }),
    defineField({
      name: "price",
      group: "content",
      type: "object",
      fields: [
        defineField({
          name: "value",
          type: "number",
        }),
        defineField({
          name: "period",
      group: "content",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "list",
      group: "content",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "excerpt",
      group: "content",
      type: "text",
    }),
    defineField({
      name: "link",
      group: "content",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price.value",
      period: "price.period",
    },
    prepare({ title, price, period }) {
      return {
        title: "Pricing Card",
        subtitle: `${title}: ${price}${period}`,
      };
    },
  },
});
