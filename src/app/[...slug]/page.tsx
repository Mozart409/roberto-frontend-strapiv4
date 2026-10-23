import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SEO } from "@/app/utils/constants";
import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import { sectionRenderer } from "@/app/utils/section-renderer";

// Define props type
type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

// Generate metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const page: any = await getPageBySlug(params.slug, params.lang);

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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const page: any = await getPageBySlug(params.slug, params.lang);

  if (page.error) {
    throw new Error(
      `Strapi ${page.error.status} ${page.error.name}: ${page.error.message}`,
    );
  }
  if (page.data.length === 0) notFound();

  const contentSections = page.data[0].attributes.contentSections;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return contentSections.map((section: any, index: number) =>
    sectionRenderer(section, index),
  );
}
