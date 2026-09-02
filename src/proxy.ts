import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  console.log(token, " ", pathname);

  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/sign-up") &&
    !pathname.startsWith("/select-account")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
