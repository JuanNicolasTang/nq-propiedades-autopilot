import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await isAdminSessionTokenValid(sessionCookie);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    if (!isAuthenticated) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin/leads", request.url));
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
