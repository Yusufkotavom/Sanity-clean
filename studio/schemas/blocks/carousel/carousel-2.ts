import { defineField, defineType } from "sanity";
import { Quote } from "lucide-react";

export default defineType({
  name: "carousel-2",
  type: "object",
  title: "Carousel 2",
  icon: Quote,
  description: "A carousel of testimonials",
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
  },
  fields: [
    defineField({
      name: "testimonial",
      type: "array",
      of: [
        {
          name: "testimonial",
          type: "reference",
          to: [{ type: "testimonial" }],
        },
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
      title: "testimonial.0.name",
    },
    prepare({ title }) {
      return {
        title: "Testimonials Carousel",
        subtitle: title,
      };
    },
  },
});
