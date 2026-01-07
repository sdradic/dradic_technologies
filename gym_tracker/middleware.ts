import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ["/login"];
  const path = request.nextUrl.pathname;

  // Check if the current path is public
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // For protected routes, check for auth token in cookies
  // Supabase stores auth in localStorage, so we'll handle auth redirects client-side
  // This middleware is primarily for Next.js routing
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
