import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function normalizeRouteKey(pathname: string): string {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");

  return cleanPath.length > 0 ? cleanPath : "index";
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-route-key", normalizeRouteKey(request.nextUrl.pathname));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
