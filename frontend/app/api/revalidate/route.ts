import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string };
  path?: string;
};

function getSecret(request: NextRequest) {
  return (
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret")
  );
}

function collectPaths(payload: WebhookPayload | null) {
  const paths = new Set<string>();

  const contentType = payload?._type;
  const slug = payload?.slug?.current;
  const explicitPath = payload?.path;

  if (explicitPath?.startsWith("/")) {
    paths.add(explicitPath);
  }

  // No type info = unknown change, revalidate homepage only
  if (!contentType) {
    paths.add("/");
    return paths;
  }

  switch (contentType) {
    case "post":
      paths.add("/blog");
      paths.add("/blog/category");
      if (slug) paths.add(`/blog/${slug}`);
      break;

    case "product":
      paths.add("/products");
      if (slug) paths.add(`/products/${slug}`);
      break;

    case "service":
      paths.add("/services");
      if (slug) paths.add(`/services/${slug}`);
      break;

    case "project":
      paths.add("/projects");
      if (slug) paths.add(`/projects/${slug}`);
      break;

    case "category":
      paths.add("/blog/category");
      paths.add("/products");
      paths.add("/services");
      if (slug) {
        paths.add(`/blog/category/${slug}`);
        paths.add(`/products/${slug}`);
        paths.add(`/services/${slug}`);
      }
      break;

    case "page":
      if (slug && slug !== "index") {
        paths.add(`/${slug}`);
      } else {
        paths.add("/");
      }
      break;

    case "faq":
    case "testimonial":
    case "reusableSection":
      // These appear embedded in pages — revalidate homepage only
      paths.add("/");
      break;

    case "navigation":
    case "settings":
    case "siteSettings":
      // Global layout data — revalidate key pages
      paths.add("/");
      paths.add("/blog");
      paths.add("/products");
      paths.add("/services");
      break;

    case "seoSettings":
    case "ogSettings":
    case "themeSettings":
      // Metadata/theme — revalidate homepage (layout picks up on next visit)
      paths.add("/");
      break;

    case "redirect":
    case "generatorProgram":
    case "generatorTemplate":
    case "generatorDataset":
    case "seoOpsSettings":
      // Config docs — no frontend pages to revalidate
      break;

    default:
      // Unknown type — revalidate homepage as safe fallback
      paths.add("/");
      break;
  }

  return paths;
}

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;

  if (!configuredSecret) {
    return NextResponse.json(
      { ok: false, message: "Missing REVALIDATE_SECRET on server" },
      { status: 500 },
    );
  }

  const providedSecret = getSecret(request);
  if (!providedSecret || providedSecret !== configuredSecret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload | null = null;

  try {
    payload = (await request.json()) as WebhookPayload;
  } catch {
    payload = null;
  }

  const paths = collectPaths(payload);

  // Theme/settings affect the root layout across all routes
  const layoutTypes = ["themeSettings", "settings", "siteSettings", "navigation"];
  const needsLayoutRevalidation = layoutTypes.includes(payload?._type || "");

  for (const path of paths) {
    revalidatePath(path);
  }

  if (needsLayoutRevalidation) {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(paths),
    layoutRevalidated: needsLayoutRevalidation,
    type: payload?._type || null,
    slug: payload?.slug?.current || null,
  });
}
