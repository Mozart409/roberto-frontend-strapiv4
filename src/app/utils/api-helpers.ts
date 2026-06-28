export function getStrapiURL(path = "") {
  // Strip any trailing slash so a base like "http://localhost:1337/" doesn't
  // produce "http://localhost:1337//api/..." (Strapi v5 rejects the double
  // slash with a 400).
  const base = (
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  ).replace(/\/+$/, "");
  return `${base}${path}`;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`;
}
