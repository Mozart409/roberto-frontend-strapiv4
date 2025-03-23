import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      "/manifest.json",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/check32.png",
      "/vercel.svg",
      "/next.svg",
      "/_vercel/insights/*",
      "/_vercel/speed-insights/*",
      // Your other files in `public`
    ].includes(pathname)
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  /*  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  ); */

  // Redirect if there is no locale
  /* if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products

    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url));
  } */
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!_next).*)"],
};
