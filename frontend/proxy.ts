import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function normalizeRouteKey(pathname: string): string {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");

  return cleanPath.length > 0 ? cleanPath : "index";
}

const allowedCorsOrigins = (
  process.env.NEXT_PUBLIC_ALLOWED_CORS_ORIGINS ||
  "https://devk.my.id,https://3333.devk.my.id,https://api.devk.my.id,https://sanity-clean-studio.vercel.app,https://clean-kotacom.sanity.studio,https://cms.kotacom.id,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3333"
)
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin: string) => {
  if (!origin) return false;
  return allowedCorsOrigins.some((allowed) => {
    if (allowed.startsWith("https://*.")) {
      const base = allowed.replace("https://*.", "");
      return origin.startsWith("https://") && origin.endsWith(`.${base}`);
    }
    return origin === allowed;
  });
};

const withCorsHeaders = (request: NextRequest, response: NextResponse) => {
  const origin = request.headers.get("origin") || "";
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  return response;
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/og") {
    if (request.method === "OPTIONS") {
      return withCorsHeaders(request, new NextResponse(null, { status: 204 }));
    }
    return withCorsHeaders(request, NextResponse.next());
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return withCorsHeaders(request, new NextResponse(null, { status: 204 }));
    }
    return withCorsHeaders(request, NextResponse.next());
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-route-key", normalizeRouteKey(request.nextUrl.pathname));

  return withCorsHeaders(
    request,
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
