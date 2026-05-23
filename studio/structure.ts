import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { createBulkActionsTable } from "sanity-plugin-bulk-actions-table";
import {
  Files,
  BookA,
  Package,
  BriefcaseBusiness,
  FolderKanban,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  Palette,
  Image as ImageIcon,
  SearchCheck,
  Link2,
  Blocks,
  Bot,
  MapPin,
  LayoutTemplate,
} from "lucide-react";

const isGeneratorDeskEnabled = (context: any) =>
  (context?.dataset ?? process.env.SANITY_STUDIO_DATASET ?? "production") === "development";

const createBulkTableItem = (
  S: any,
  context: any,
  {
    type,
    title,
    icon,
  }: {
    type: string;
    title: string;
    icon?: any;
  },
) =>
  createBulkActionsTable({
    type,
    title,
    icon,
    S,
    context,
  });

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Core Content")
        .icon(Files)
        .child(
          S.list()
            .title("Core Content")
            .items([
              orderableDocumentListDeskItem({
                type: "page",
                title: "Pages",
                icon: Files,
                S,
                context,
              }),
              S.listItem()
                .title("Posts")
                .schemaType("post")
                .child(
                  S.documentTypeList("post")
                    .title("Post")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              orderableDocumentListDeskItem({
                type: "product",
                title: "Products",
                icon: Package,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "service",
                title: "Services",
                icon: BriefcaseBusiness,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "project",
                title: "Projects",
                icon: FolderKanban,
                S,
                context,
              }),
            ])
        ),
      S.listItem()
        .title("Shared Docs")
        .icon(ListCollapse)
        .child(
          S.list()
            .title("Shared Docs")
            .items([
              orderableDocumentListDeskItem({
                type: "category",
                title: "Categories",
                icon: BookA,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "author",
                title: "Authors",
                icon: User,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "faq",
                title: "FAQs",
                icon: ListCollapse,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "testimonial",
                title: "Testimonials",
                icon: Quote,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "reusableSection",
                title: "Reusable Sections",
                icon: Blocks,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "blockPreset",
                title: "Block Presets",
                icon: Blocks,
                S,
                context,
              }),
            ])
        ),
      S.listItem()
        .title("Routing & Templates")
        .icon(MapPin)
        .child(
          S.list()
            .title("Routing & Templates")
            .items([
              S.listItem()
                .title("Locations")
                .icon(MapPin)
                .schemaType("location")
                .child(
                  S.documentTypeList("location")
                    .title("Locations")
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                ),
              orderableDocumentListDeskItem({
                type: "serviceType",
                title: "Service Types",
                icon: BriefcaseBusiness,
                S,
                context,
              }),
              S.listItem()
                .title("Legacy Templating")
                .icon(LayoutTemplate)
                .child(
                  S.list()
                    .title("Legacy Templating")
                    .items([
                      orderableDocumentListDeskItem({
                        type: "pageTemplate",
                        title: "Legacy Page Templates",
                        icon: LayoutTemplate,
                        S,
                        context,
                      }),
                      S.listItem()
                        .title("Legacy Page Locations")
                        .icon(MapPin)
                        .schemaType("pageLocation")
                        .child(
                          S.documentTypeList("pageLocation")
                            .title("Legacy Page Locations")
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                        ),
                      S.listItem()
                        .title("Legacy Service Locations")
                        .icon(MapPin)
                        .schemaType("serviceLocation")
                        .child(
                          S.documentTypeList("serviceLocation")
                            .title("Legacy Service Locations")
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                        ),
                    ])
                ),
              S.listItem()
                .title("Redirects")
                .icon(Link2)
                .schemaType("redirect")
                .child(
                  S.documentTypeList("redirect")
                    .title("Redirects")
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                ),
            ])
        ),
      S.listItem()
        .title("Bulk Actions")
        .icon(Files)
        .child(
          S.list()
            .title("Bulk Actions")
            .items([
              createBulkTableItem(S, context, { type: "page", title: "Pages Table", icon: Files }),
              createBulkTableItem(S, context, { type: "post", title: "Posts Table", icon: BookA }),
              createBulkTableItem(S, context, { type: "product", title: "Products Table", icon: Package }),
              createBulkTableItem(S, context, { type: "service", title: "Services Table", icon: BriefcaseBusiness }),
              createBulkTableItem(S, context, { type: "serviceType", title: "Service Types Table", icon: BriefcaseBusiness }),
              createBulkTableItem(S, context, { type: "project", title: "Projects Table", icon: FolderKanban }),
              createBulkTableItem(S, context, { type: "faq", title: "FAQs Table", icon: ListCollapse }),
              createBulkTableItem(S, context, { type: "testimonial", title: "Testimonials Table", icon: Quote }),
              createBulkTableItem(S, context, { type: "reusableSection", title: "Reusable Sections Table", icon: Blocks }),
              createBulkTableItem(S, context, { type: "location", title: "Locations Table", icon: MapPin }),
              createBulkTableItem(S, context, { type: "redirect", title: "Redirects Table", icon: Link2 }),
              ...(isGeneratorDeskEnabled(context)
                ? [
                    S.divider(),
                    createBulkTableItem(S, context, {
                      type: "generatorProgram",
                      title: "Generator Programs Table",
                      icon: LayoutTemplate,
                    }),
                    createBulkTableItem(S, context, {
                      type: "generatorTemplate",
                      title: "Generator Templates Table",
                      icon: Blocks,
                    }),
                    createBulkTableItem(S, context, {
                      type: "generatorDataset",
                      title: "Generator Datasets Table",
                      icon: Files,
                    }),
                  ]
                : []),
              S.divider(),
              createBulkTableItem(S, context, { type: "pageTemplate", title: "Legacy Page Templates Table", icon: LayoutTemplate }),
              createBulkTableItem(S, context, { type: "pageLocation", title: "Legacy Page Locations Table", icon: MapPin }),
              createBulkTableItem(S, context, { type: "serviceLocation", title: "Legacy Service Locations Table", icon: MapPin }),
            ])
        ),
      ...(isGeneratorDeskEnabled(context)
        ? [
            S.listItem()
              .title("Generator")
              .icon(LayoutTemplate)
              .child(
                S.list()
                  .title("Generator")
                  .items([
                    orderableDocumentListDeskItem({
                      type: "generatorProgram",
                      title: "Programs",
                      icon: LayoutTemplate,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: "generatorTemplate",
                      title: "Templates",
                      icon: Blocks,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: "generatorDataset",
                      title: "Datasets",
                      icon: Files,
                      S,
                      context,
                    }),
                  ])
              ),
          ]
        : []),
      S.divider({ title: "Global" }),
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.editor()
            .id("navigation")
            .schemaType("navigation")
            .documentId("navigation")
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings")
        ),
      S.listItem()
        .title("Theme Settings")
        .icon(Palette)
        .child(
          S.editor()
            .id("themeSettings")
            .schemaType("themeSettings")
            .documentId("themeSettings")
        ),
      S.listItem()
        .title("SEO Settings")
        .icon(SearchCheck)
        .child(
          S.editor()
            .id("seoSettings")
            .schemaType("seoSettings")
            .documentId("seoSettings")
        ),
      S.listItem()
        .title("OG Settings")
        .icon(ImageIcon)
        .child(
          S.editor()
            .id("ogSettings")
            .schemaType("ogSettings")
            .documentId("ogSettings")
        ),
      S.listItem()
        .title("SEO Ops Settings")
        .icon(Bot)
        .child(
          S.editor()
            .id("seoOpsSettings")
            .schemaType("seoOpsSettings")
            .documentId("seoOpsSettings")
        ),
    ]);
