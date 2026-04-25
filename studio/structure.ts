import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
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
  SearchCheck,
  Link2,
  Blocks,
  Bot,
  MapPin,
  LayoutTemplate,
} from "lucide-react";

const isGeneratorDeskEnabled = (context: any) =>
  (context?.dataset ?? process.env.SANITY_STUDIO_DATASET ?? "production") === "development";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
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
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]) // Default ordering
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
        type: "serviceType",
        title: "Service Types",
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
        .title("Locations")
        .icon(MapPin)
        .schemaType("location")
        .child(
          S.documentTypeList("location")
            .title("Locations")
            .defaultOrdering([{ field: "title", direction: "asc" }])
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
        .title("SEO Ops Settings")
        .icon(Bot)
        .child(
          S.editor()
            .id("seoOpsSettings")
            .schemaType("seoOpsSettings")
            .documentId("seoOpsSettings")
        ),
    ]);
