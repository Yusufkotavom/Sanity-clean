import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";

export default defineType({
  name: "logo-cloud-1",
  type: "object",
  icon: Images,
  initialValue: {
    colorVariant: "background",
    title: "Dipercaya oleh tim bisnis dari berbagai industri",
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        }),
      ],
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
        title: "Logo Cloud",
        subtitle: title || "No Title",
      };
    },
  },
});
