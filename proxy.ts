import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";

  // If user is on the login or register page
  if (isAuthPage) {
    if (isAuth) {
      // Redirect logged-in users to the dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Allow unauthenticated users to access login/register
    return null;
  }

  // If the user is NOT authenticated and trying to access a protected route
  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and visits the root `/`, redirect to `/dashboard`
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest (metadata files)
     * - sw.js, workbox-* (service worker files)
     * - icon.svg, apple-icon.png (PWA icons)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|icon.svg|apple-icon.png|sw.js|workbox-.*).*)",
  ],
};
