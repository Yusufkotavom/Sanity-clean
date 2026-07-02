import { defineType, defineField } from "sanity";
import { AlertCircle } from "lucide-react";

export default defineType({
  name: "problem-solution-block",
  title: "Problem Solution Block",
  type: "object",
  icon: AlertCircle,
  initialValue: {
    padding: {
      _type: "section-padding",
      top: true,
      bottom: true,
    },
    colorVariant: "background",
    title: "Apakah Bisnis Anda Mengalami Masalah Ini?",
    problems: [
      "Pesan layanan belum cukup jelas untuk calon pelanggan.",
      "Halaman terlalu datar dan tidak mengarahkan ke CTA utama.",
    ],
    solutionTitle: "💡 Solusi:",
    solution: "Struktur halaman yang lebih rapi dan fokus dapat membantu visitor memahami penawaran lebih cepat.",
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Apakah Bisnis Anda Mengalami Masalah Ini?",
    }),
    defineField({
      name: "problems",
      type: "array",
      of: [{ type: "string" }],
      description: "List masalah yang dihadapi bisnis",
    }),
    defineField({
      name: "solutionTitle",
      type: "string",
      title: "Solution Title",
      initialValue: "💡 Solusi:",
    }),
    defineField({
      name: "solution",
      type: "text",
      rows: 3,
      initialValue: "Website profesional yang responsif dan SEO-friendly dapat meningkatkan omset bisnis Anda hingga 200% dalam 6 bulan!",
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
        title: "Problem Solution",
        subtitle: title,
      };
    },
  },
});
