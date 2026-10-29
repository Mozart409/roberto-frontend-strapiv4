import qs from "qs";

// The specs read the same Strapi the app is built against and assert that the
// rendered pages match it, so content edits in the CMS don't break the suite.

interface StrapiLink {
  id: number;
  text: string;
  url: string;
  newTab: boolean;
  social?: string;
}

interface StrapiSection {
  __component: string;
}

export interface StrapiPage {
  slug: string;
  seo?: { metaTitle?: string } | null;
  contentSections?: StrapiSection[];
}

interface StrapiGlobal {
  metadata: { metaTitle: string };
  navbar: { links: StrapiLink[] };
  footer: {
    menuLinks: StrapiLink[];
    legalLinks: StrapiLink[];
    socialLinks: StrapiLink[];
  };
}

const PAGE_SIZE = 100;

async function fetchStrapi<T>(path: string, params: object): Promise<T> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_STRAPI_API_TOKEN is not set");

  const base = (
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  ).replace(/\/+$/, "");
  const res = await fetch(`${base}/api${path}?${qs.stringify(params)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Strapi ${path} returned ${res.status}`);
  return (await res.json()) as T;
}

export async function getPages(): Promise<StrapiPage[]> {
  const res = await fetchStrapi<{
    data: StrapiPage[];
    meta: { pagination: { total: number } };
  }>("/pages", {
    locale: "de",
    pagination: { pageSize: PAGE_SIZE },
  });
  if (res.meta.pagination.total > PAGE_SIZE) {
    throw new Error(
      `Strapi has ${res.meta.pagination.total} pages; raise PAGE_SIZE`,
    );
  }
  return res.data;
}

export async function getGlobal(): Promise<StrapiGlobal> {
  const res = await fetchStrapi<{ data: StrapiGlobal }>("/global", {
    locale: "de",
    populate: {
      metadata: true,
      navbar: { populate: { links: true } },
      footer: {
        populate: { menuLinks: true, legalLinks: true, socialLinks: true },
      },
    },
  });
  return res.data;
}

export function pathForSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}
