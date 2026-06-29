import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;


  if (!token && !pathname.startsWith("/login") && !pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }


  if (
    token &&
    (pathname.startsWith("/login") ||
     pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }


  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico).*)",
  ],
};