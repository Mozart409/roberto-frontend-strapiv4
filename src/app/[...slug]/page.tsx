import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SEO } from "@/app/utils/constants";
import { fetchAPI } from "@/app/utils/fetch-api";
import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import { sectionRenderer } from "@/app/utils/section-renderer";

// Define props type
type Props = {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
};

const PAGE_SIZE = 100;

// Every CMS page is prerendered at build time, so the deployed site doesn't
// call Strapi at runtime. Unknown slugs 404 instead of rendering on demand;
// publishing a new page in Strapi needs a rebuild.
export const dynamicParams = false;

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  // biome-ignore lint/suspicious/noExplicitAny: Strapi response is dynamic
  const pages: any = await fetchAPI(
    "/pages",
    { locale: "de", pagination: { pageSize: PAGE_SIZE } },
    options,
  );

  if (pages.error) {
    throw new Error(
      `Strapi ${pages.error.status} ${pages.error.name}: ${pages.error.message}`,
    );
  }
  if (pages.meta.pagination.total > PAGE_SIZE) {
    throw new Error(
      `Strapi has ${pages.meta.pagination.total} pages; raise PAGE_SIZE`,
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: Strapi response is dynamic
  return pages.data.map((page: any) => ({ slug: [page.attributes.slug] }));
}

// Generate metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // biome-ignore lint/suspicious/noExplicitAny: Strapi response is dynamic
  const page: any = await getPageBySlug(params.slug.join("/"), params.lang);

  // Check if page data is empty or lacks SEO attributes
  if (!page.data?.length || !page.data[0]?.attributes?.seo) {
    return FALLBACK_SEO;
  }

  const metadata = page.data[0].attributes.seo;
  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

// Page component
export default async function PageRoute(props: Props) {
  const params = await props.params;
  // biome-ignore lint/suspicious/noExplicitAny: Strapi response is dynamic
  const page: any = await getPageBySlug(params.slug.join("/"), params.lang);

  if (page.error) {
    throw new Error(
      `Strapi ${page.error.status} ${page.error.name}: ${page.error.message}`,
    );
  }
  if (page.data.length === 0) notFound();

  const contentSections = page.data[0].attributes.contentSections;
  // biome-ignore lint/suspicious/noExplicitAny: Strapi sections are dynamic
  return contentSections.map((section: any, index: number) =>
    sectionRenderer(section, index),
  );
}
