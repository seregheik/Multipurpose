import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // localStorage is not available in middleware, use cookies instead
  const token = request.cookies.get("QizzAppName")?.value;

  if (token) {
    // If user has token but is NOT on a quiz page, redirect to quiz
    if (!pathname.startsWith("/quiz")) {
      return NextResponse.redirect(new URL("/quiz", request.url));
    }
  } else {
    // If user has no token but IS on a quiz page, redirect to home
    if (pathname.startsWith("/quiz")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to continue normally
  return NextResponse.next();
}

// Optional: Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
