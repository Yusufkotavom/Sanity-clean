import { defineField, defineType, defineArrayMember } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-2",
  title: "Hero 2",
  type: "object",
  icon: LayoutTemplate,
  initialValue: {
    tagLine: "Partner Teknologi Bisnis",
    title: "Website, Software, dan IT Support dalam satu tim",
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
            text: "Pendekatan one-stop untuk operasional dan pemasaran digital: mulai dari development hingga support harian.",
          },
        ],
      },
    ],
    links: [
      {
        _key: "link-1",
        _type: "link",
        isExternal: true,
        title: "Lihat Portofolio",
        href: "/portfolio",
        buttonVariant: "default",
      },
      {
        _key: "link-2",
        _type: "link",
        isExternal: false,
        title: "Hubungi Tim",
        target: false,
        buttonVariant: "link",
      },
    ],
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
          name: "images",
          title: "Images",
          type: "array",
          
          of: [
            defineArrayMember({
              type: "object",
              name: "heroImage",
              fields: [
                defineField({
                  name: "image",
                  type: "image",
                  title: "Image",
                  options: { hotspot: true },
                  fields: [
                    { name: "alt", type: "string", title: "Alternative Text" },
                  ],
                }),
                defineField({ name: "title",
      type: "string", title: "Title" }),
                defineField({ name: "description",
      type: "text", title: "Description", rows: 2 }),
                defineField({ name: "link",
      type: "link", title: "Link" }),
              ],
              preview: {
                select: { title: "title", media: "image" },
                prepare({ title, media }: { title?: string; media?: any }) {
                  return { title: title || "Hero Image", media };
                },
              },
            }),
          ],
        }),
        defineField({
          name: "links",
          type: "array",
          of: [{ type: "link" }],
          
          validation: (rule) => rule.max(2),
        }),
        defineField({
          name: "useCard",
          type: "boolean",
          title: "Card Style",
          description: "Display content inside a rounded card",
          
          initialValue: true,
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
    prepare({ title }: { title?: string }) {
      return {
        title: "Hero 2",
        subtitle: title,
      };
    },
  },
});
