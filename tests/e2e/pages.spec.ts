import { expect, test } from "@playwright/test";
import { FALLBACK_SEO } from "@/app/utils/constants";
import { getGlobal, getPages, pathForSlug } from "./strapi";

test("every Strapi page renders with its SEO title", async ({
  page,
}, testInfo) => {
  const [pages, global] = await Promise.all([getPages(), getGlobal()]);
  expect(pages.length, "Strapi returned no pages").toBeGreaterThan(0);

  const results = [];
  for (const strapiPage of pages) {
    const path = pathForSlug(strapiPage.slug);
    // `/` has no page metadata and inherits the global title; slug pages use
    // their own SEO component or fall back to FALLBACK_SEO.
    const expectedTitle =
      path === "/"
        ? global.metadata.metaTitle
        : (strapiPage.seo?.metaTitle ?? FALLBACK_SEO.title);

    const response = await page.goto(path);
    expect.soft(response?.status(), `${path} status`).toBe(200);
    await expect.soft(page, `${path} title`).toHaveTitle(expectedTitle);
    await expect
      .soft(
        page.getByRole("heading", {
          name: /Seite nicht gefunden|Etwas ist schiefgelaufen/,
        }),
        `${path} renders an error state`,
      )
      .toHaveCount(0);

    results.push({
      slug: strapiPage.slug,
      path,
      status: response?.status(),
      title: await page.title(),
      sections: strapiPage.contentSections?.map((s) => s.__component) ?? [],
    });
  }

  await testInfo.attach("pages.json", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
});
