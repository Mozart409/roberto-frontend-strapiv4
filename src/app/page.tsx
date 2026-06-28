import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import LangRedirect from "./components/LangRedirect";
import { sectionRenderer } from "./utils/section-renderer";

export default async function RootRoute(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Strapi response is dynamic
    const page: any = await getPageBySlug("home", params.lang);
    if (page.error && page.error.status === 401) {
      throw new Error(
        "Missing or invalid credentials. Have you created an access token using the Strapi admin panel? http://localhost:1337/admin/",
      );
    }

    if (page.data.length === 0 && params.lang !== "en") return <LangRedirect />;
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].attributes.contentSections;
    // biome-ignore lint/suspicious/noExplicitAny: Strapi sections are dynamic
    return contentSections.map((section: any, index: number) =>
      sectionRenderer(section, index),
    );
    // biome-ignore lint/suspicious/noExplicitAny: error type is dynamic
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to load homepage: ${error.message ?? error}`);
  }
}
