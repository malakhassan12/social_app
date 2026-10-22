import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { getSession } from "@/lib/temp-session-for-select-account/session";

const publicPaths = new Set([
  "/",
  "/about",
  "/help",
  "/login",
  "/privacy",
  "/robots.txt",
  "/select-account",
  "/sign-up",
  "/sitemap.xml",
  "/terms",
]);
const authenticationPaths = new Set([
  "/login",
  "/select-account",
  "/sign-up",
]);

function isPublicPath(pathname: string) {
  return publicPaths.has(pathname.replace(/\/+$/, "") || "/");
}

function isAuthenticationPath(pathname: string) {
  return authenticationPaths.has(pathname.replace(/\/+$/, "") || "/");
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // =====================================================
  // Validate existing token
  // =====================================================

  if (token) {
    try {
      await getSession(token);
    } catch {
      // Token exists in browser but session
      // no longer exists in Redis

      const response = NextResponse.redirect(new URL("/", request.url));

      response.cookies.delete("token");

      return response;
    }
  }

  // =====================================================
  // No token -> protected pages
  // =====================================================

  if (
    !token &&
    !isPublicPath(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // =====================================================
  // Valid token -> auth pages
  // =====================================================

  if (token && isAuthenticationPath(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:avif|css|gif|ico|jpe?g|js|map|png|svg|txt|webp|woff2?|xml)$).*)",
  ],
};
