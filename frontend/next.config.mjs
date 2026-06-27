/** @type {import('next').NextConfig} */
import { createClient } from "@sanity/client";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-01";
const SANITY_REDIRECT_TOKEN =
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_DEPLOY ||
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_DEV;

const STATIC_REDIRECTS = [
  {
    source: "/index",
    destination: "/",
    permanent: true,
  },
  {
    source: "/portfolio",
    destination: "/projects",
    permanent: true,
  },
  {
    source: "/services/ecommerce-development",
    destination: "/services",
    permanent: false,
  },
  {
    source: "/product/:slug",
    destination: "/products/:slug",
    permanent: true,
  },
  {
    source: "/service/:slug",
    destination: "/services/:slug",
    permanent: true,
  },
  {
    source: "/digital-product/:slug",
    destination: "/products/:slug",
    permanent: true,
  },
  {
    source: "/it-services/:slug",
    destination: "/services/:slug",
    permanent: true,
  },
  {
    source: "/product-tag/:slug*",
    destination: "/products",
    permanent: true,
  },
  {
    source: "/product-category/:slug*",
    destination: "/products",
    permanent: true,
  },
  {
    source: "/posts",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/posts/blog",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/posts/:slug",
    destination: "/blog/:slug",
    permanent: true,
  },
  {
    source: "/tag/:slug*",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/page/:page",
    destination: "/blog",
    permanent: true,
  },
  // --- Structural redirects: old URL patterns -> new canonical routes ---
  // /jasa-pembuatan-website-{kota} -> /pembuatan-website/{kota}
  {
    source: "/jasa-pembuatan-website-:city",
    destination: "/pembuatan-website/:city",
    permanent: true,
  },
  // /pembuatan-website-{kota} -> /pembuatan-website/{kota}
  {
    source: "/pembuatan-website-:city",
    destination: "/pembuatan-website/:city",
    permanent: true,
  },
  // /website-{kota} -> /pembuatan-website/{kota}
  {
    source: "/website-:city",
    destination: "/pembuatan-website/:city",
    permanent: true,
  },
  // /jasa-cetak-kalender-{kota} -> /percetakan/cetak-kalender/{kota}
  {
    source: "/jasa-cetak-kalender-:city",
    destination: "/percetakan/cetak-kalender/:city",
    permanent: true,
  },
  // /cetak-kalender-{kota} -> /percetakan/cetak-kalender/{kota}
  {
    source: "/cetak-kalender-:city",
    destination: "/percetakan/cetak-kalender/:city",
    permanent: true,
  },
  // /software-{kota} -> /software
  {
    source: "/software-:city",
    destination: "/software",
    permanent: true,
  },
];

const REDIRECTS_QUERY = `*[
  _type == "redirect"
  && isEnabled == true
  && defined(source)
  && defined(destination)
]{
  source,
  destination,
  permanent
}`;

async function fetchSanityRedirects() {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
    console.warn(
      "[next.config] Sanity redirect loader skipped: missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET",
    );
    return [];
  }

  try {
    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      perspective: "published",
      token: SANITY_REDIRECT_TOKEN,
    });

    const redirects = await client.fetch(REDIRECTS_QUERY);
    if (!Array.isArray(redirects)) {
      console.warn("[next.config] Sanity redirect loader returned non-array payload");
      return [];
    }

    const normalized = redirects
      .filter((item) => item && typeof item.source === "string" && typeof item.destination === "string")
      .map((item) => ({
        source: item.source,
        destination: item.destination,
        permanent: Boolean(item.permanent),
      }));

    console.log(
      "[next.config] Sanity redirects loaded",
      JSON.stringify({
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        apiVersion: SANITY_API_VERSION,
        tokenMode: SANITY_REDIRECT_TOKEN ? "authenticated" : "anonymous",
        count: normalized.length,
        sample: normalized.slice(0, 3),
      }),
    );

    return normalized;
  } catch (error) {
    console.warn("[next.config] Failed to load Sanity redirects:", error);
    return [];
  }
}

const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  allowedDevOrigins: [
    '168.110.210.101',
    'devk.my.id',
    '.devk.my.id',
    'localhost',
    '127.0.0.1',
  ],
  async redirects() {
    const sanityRedirects = await fetchSanityRedirects();
    return [...STATIC_REDIRECTS, ...sanityRedirects];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [60, 75, 85, 100],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Vary",
            value: "Origin",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' http://localhost:* https://*.sanity.studio https://*.vercel.app https://sanity.kotacom.id; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
