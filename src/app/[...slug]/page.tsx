import { FALLBACK_SEO } from "@/app/utils/constants";
import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import { sectionRenderer } from "@/app/utils/section-renderer";
import type { Metadata } from "next";

type Props = {
  params: {
    lang: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page: any = await getPageBySlug(params.slug, params.lang);
  if (page.data[0].length === 0 && page.data[0].attributes.seo === undefined) {
    return FALLBACK_SEO;
  }

  const metadata = page.data[0].attributes.seo;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

export default async function PageRoute({ params }: Props) {
  const page: any = await getPageBySlug(params.slug, params.lang);
  // if (page.data[0].length === 0) return null
  if (page.data[0].length === 0) {
    return (
      <>
        <h1 className="text-3xl font-bold">404 Content not found!</h1>
      </>
    );
  }
  const contentSections = page.data[0].attributes.contentSections;
  return contentSections.map((section: any, index: number) =>
    sectionRenderer(section, index),
  );
}
