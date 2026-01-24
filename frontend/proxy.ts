import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Function name changed to "proxy"
export async function proxy(request: NextRequest) {
  // const token = request.cookies.get("connect.sid");

  const token = await request.cookies.get("connect.sid")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/setting", "/addbook", "/allbooks"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  console.log(" The token is", token)
  console.log("route ",isProtectedRoute)
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 2. The matcher remains exactly the same
  matcher: ["/dashboard/:path*", "/setting/:path*", "/addbook/:path*", "/allbooks/:path*", "/auth/:path*"],
};