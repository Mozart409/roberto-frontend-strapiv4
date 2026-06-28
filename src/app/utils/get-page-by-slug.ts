import { fetchAPI } from "@/app/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const path = "/pages";
  // Populate is intentionally omitted: the backend `page-populate-middleware`
  // overrides the query and drives population itself, so anything sent here is
  // discarded. We only need the slug filter and locale.
  const urlParamsObject = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    // locale: lang,
    locale: "de",
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };

  return await fetchAPI(path, urlParamsObject, options);
}
