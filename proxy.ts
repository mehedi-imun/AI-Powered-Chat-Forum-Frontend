import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value; // 'admin' or 'user'

  const { pathname } = request.nextUrl;

  // Auth pages (login, register)
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  // Protected dashboard routes
  const isUserDashboard = pathname.startsWith("/dashboard");
  const isAdminDashboard = pathname.startsWith("/admin");

  // Redirect logged-in users away from auth pages
  if (isAuthPage && token) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect user dashboard - require authentication
  if (isUserDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect admin dashboard - require authentication AND admin role
  if (isAdminDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "admin") {
      // Non-admin users trying to access admin area - redirect to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
