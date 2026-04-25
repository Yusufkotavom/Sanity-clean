import { defineField, defineType } from "sanity";
import { MapPinned } from "lucide-react";
import pageBlocks from "../blocks/shared/page-blocks";
import meta from "../blocks/shared/meta";
import AutoRouteInput from "../../inputs/auto-route-input";

const LEGACY_RUNTIME_NOTE =
  "Legacy templating field. Kept for migration/reference only and no longer drives the preferred Generator V2 workflow.";

export default defineType({
  name: "serviceLocation",
  title: "Legacy Service Location",
  type: "document",
  icon: MapPinned,
  groups: [
    { name: "content", title: "Content" },
    { name: "hero", title: "Hero" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "route",
      title: "Route",
      type: "string",
      group: "settings",
      description: "Path URL lengkap, contoh: /jasa-cetak-buku-surabaya",
      components: {
        input: AutoRouteInput,
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return /^\/[a-z0-9\-\/]*$/.test(value)
            ? true
            : "Route harus dimulai dengan / dan hanya memakai huruf kecil, angka, dash, serta slash.";
        }),
    }),
    defineField({
      name: "routePattern",
      title: "Route Pattern",
      type: "string",
      group: "settings",
      description:
        "Opsional pola URL, contoh: /software/{lokasi}. Akan diubah otomatis ke Route memakai slug.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return /^\/[a-z0-9\-\/{}]*$/.test(value)
            ? true
            : "Route pattern hanya boleh memakai huruf kecil, angka, dash, slash, dan token kurung kurawal.";
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: () => true,
      },
      description:
        "Tidak dipakai untuk routing. Aman jika sama di banyak dokumen (dipakai untuk auto route).",
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "reference",
      to: [{ type: "service" }],
      group: "settings",
      description: "Reference to full Service document (for detail pages)",
      hidden: ({ document }) => !!document?.serviceType,
    }),
    defineField({
      name: "serviceType",
      title: "Service Type",
      type: "reference",
      to: [{ type: "serviceType" }],
      group: "settings",
      description: "Reference to Service Type (for location-based pages, recommended)",
      hidden: ({ document }) => !!document?.service,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
      group: "settings",
    }),
    defineField({
      name: "template",
      title: "Page Template",
      type: "reference",
      to: [{ type: "pageTemplate" }],
      group: "settings",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "structured",
      title: "Structured Copy Override",
      type: "templateRewriteCopy",
      group: "content",
    }),
    {
      ...pageBlocks,
      title: "Legacy Page Blocks",
      description: `${LEGACY_RUNTIME_NOTE} The current runtime no longer consumes blocks from legacy service-location documents.`,
      hidden: true,
    },
    defineField({
      name: "topBlockCount",
      title: "Top Block Count",
      type: "number",
      group: "settings",
      description: `${LEGACY_RUNTIME_NOTE} The current runtime no longer consumes this field.`,
      validation: (Rule) => Rule.integer().min(0),
      hidden: true,
    }),
    defineField({
      name: "contentStatus",
      title: "Content Status",
      type: "string",
      group: "settings",
      description:
        "Dipakai hanya oleh tooling/audit indexing internal. Tidak mengubah render halaman frontend.",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Index", value: "index" },
        ],
      },
      initialValue: "draft",
    }),
    meta,
  ],
  preview: {
    select: {
      title: "title",
      route: "route",
      service: "service.title",
      location: "location.title",
    },
    prepare({ title, route, service, location }) {
      const label = [service, location].filter(Boolean).join(" · ");
      return {
        title: title || "Legacy Service Location",
        subtitle: label || route || "",
      };
    },
  },
});
