import { defineField, defineType } from "sanity";
import { Link2 } from "lucide-react";

export default defineType({
  name: "block-preset-ref",
  title: "Block Preset Reference",
  type: "object",
  icon: Link2,
  fields: [
    defineField({
      name: "preset",
      title: "Preset",
      type: "reference",
      to: [{ type: "blockPreset" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "preset.title",
      category: "preset.category",
    },
    prepare({ title, category }) {
      return {
        title: `🔗 ${title || "Block Preset"}`,
        subtitle: category || "reference",
      };
    },
  },
});
