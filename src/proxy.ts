import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { getSession } from "@/lib/temp-session-for-select-account/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  console.log(token, " ", pathname);

  // =====================================================
  // Validate existing token
  // =====================================================

  if (token) {
    try {
      await getSession(token);
    } catch {
      // Token exists in browser but session
      // no longer exists in Redis

      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("token");

      return response;
    }
  }

  // =====================================================
  // No token -> protected pages
  // =====================================================

  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/sign-up") &&
    !pathname.startsWith("/select-account")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // =====================================================
  // Valid token -> auth pages
  // =====================================================

  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/select-account"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
