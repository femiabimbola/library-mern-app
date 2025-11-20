import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("connect.sid");
  const { pathname } = request.nextUrl;

  // 1. Define the list of routes that require authentication
  const protectedRoutes = ["/dashboard", "/setting", "/addbook", "/allbooks"];

  // 2. Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // CASE A: User is NOT logged in AND trying to access a protected route
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    // (Optional) Add the original URL as a parameter so you can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASE B: User IS logged in AND trying to access auth pages (like login/register)
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 3. UPDATE THE MATCHER
  // The middleware will ONLY run on these paths.
  // Use :path* to include all sub-paths (e.g., /setting/profile)
  matcher: ["/dashboard/:path*", "/setting/:path*", "/addbook/:path*", "/allbooks/:path*", "/auth/:path*"],
};

// if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }
