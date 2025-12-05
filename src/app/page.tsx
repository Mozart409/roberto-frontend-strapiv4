import { getPageBySlug } from "@/app/utils/get-page-by-slug";
import LangRedirect from "./components/LangRedirect";
import { sectionRenderer } from "./utils/section-renderer";

;

export default async function RootRoute(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const page: any = await getPageBySlug("home", params.lang);
    if (page.error && page.error.status === 401) {
      throw new Error(
        "Missing or invalid credentials. Have you created an access token using the Strapi admin panel? http://localhost:1337/admin/",
      );
    }

    if (page.data.length === 0 && params.lang !== "en") return <LangRedirect />;
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].attributes.contentSections;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return contentSections.map((section: any, index: number) => sectionRenderer(section, index));
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error(error);
    window.alert("Missing or invalid credentials");
  }
}
