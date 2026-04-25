import { type DefaultDocumentNodeResolver } from "sanity/structure";
import { Iframe } from "sanity-plugin-iframe-pane";
import { ProgramRunnerPane } from "./components/generator/program-runner-pane";

const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";
const isGeneratorStudioEnabled =
  (process.env.SANITY_STUDIO_DATASET || "production") === "development";

// Specify document types that should have preview panes
const previewSchemaTypes = ["page", "post", "project", "contact"];

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType },
) => {
  if (schemaType === "generatorProgram" && isGeneratorStudioEnabled) {
    return S.document().views([
      S.view.form(),
      S.view.component(ProgramRunnerPane).title("Generator Run"),
    ]);
  }

  // Add previews for specified schema types
  if (previewSchemaTypes.includes(schemaType)) {
    return S.document().views([
      S.view.form(),
      S.view
        .component(Iframe)
        .title("Preview")
        .options({
          url: {
            origin: SANITY_STUDIO_PREVIEW_URL,
            preview: (doc: any) => {
              let path = "/";

              if (doc._type === "page") {
                const slug = doc.slug?.current;
                if (slug === "index") {
                  path = "/";
                } else {
                  path = slug ? `/${slug}` : "/";
                }
              } else if (doc._type === "post") {
                const slug = doc.slug?.current;
                path = slug ? `/blog/${slug}` : "/blog";
              } else if (doc._type === "project") {
                const slug = doc.slug?.current;
                path = slug ? `/projects/${slug}` : "/projects";
              } else if (doc._type === "contact") {
                path = "/contact";
              }

              // Add iframe parameter to distinguish from presentation mode
              return path;
            },
            draftMode: "/api/draft-mode/enable",
          },
          defaultSize: "desktop",
          reload: {
            button: true,
          },
        }),
    ]);
  }

  // Return default views for other document types
  return S.document().views([S.view.form()]);
};
