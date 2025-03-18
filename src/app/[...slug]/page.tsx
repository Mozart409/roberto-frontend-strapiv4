import { FALLBACK_SEO } from "@/app/utils/constants";
import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import { sectionRenderer } from "@/app/utils/section-renderer";
import type { Metadata } from "next";

// Define props type
type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export const runtime = "edge";

// Generate metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const page: any = await getPageBySlug(params.slug, params.lang);

  // Check if page data is empty or lacks SEO attributes
  if (page.data.length === 0 || !page.data[0]?.attributes?.seo) {
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

  // Return 404 if no page data is found
  if (page.data.length === 0) {
    return (
      <>
        <h1 className="text-3xl font-bold">404 Content not found!</h1>
      </>
    );
  }

  const contentSections = page.data[0].attributes.contentSections;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return contentSections.map((section: any, index: number) =>
    sectionRenderer(section, index),
  );
}
