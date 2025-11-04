import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "./lib/helpers/jwtHelpers";

interface DecodedToken {
	userId: string;
	role: string;
	iat?: number;
	exp?: number;
}

export function proxy(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken")?.value;
	const { pathname } = request.nextUrl;

	console.log("Proxy middleware:", pathname);

	// Auth pages (login, register, verify-email, forgot-password)
	const authRoutes = [
		"/login",
		"/register",
		"/verify-email",
		"/forgot-password",
	];
	const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

	// If no token, redirect to login (except auth pages and public routes)
	if (!accessToken) {
		if (isAuthPage || pathname === "/" || pathname.startsWith("/threads")) {
			return NextResponse.next();
		}
		return NextResponse.redirect(
			new URL(
				pathname ? `/login?redirect=${pathname}` : "/login",
				request.url,
			),
		);
	}

	// Decode JWT to get user role
	const decodedToken = decode(accessToken) as DecodedToken | null;
	const role = decodedToken?.role;

	console.log("Decoded role:", role);

	// Redirect logged-in users away from auth pages
	if (isAuthPage && accessToken) {
		if (role === "Admin") {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Admin & Moderator role authorization for /admin routes
	if (
		(role === "Admin" || role === "Moderator") &&
		pathname.match(/^\/admin/)
	) {
		return NextResponse.next();
	}

	// Redirect admin/moderator users from /dashboard to /admin
	if (
		(role === "Admin" || role === "Moderator") &&
		pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	// Member role authorization for dashboard
	if (role === "Member" && pathname.match(/^\/dashboard/)) {
		return NextResponse.next();
	}

	// Block non-admin/non-moderator users from accessing admin routes
	if (pathname.startsWith("/admin") && role !== "Admin" && role !== "Moderator") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Allow public routes
	if (pathname === "/" || pathname.startsWith("/threads")) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
  ],
};
