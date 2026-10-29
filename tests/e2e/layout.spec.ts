import { expect, type Locator, test } from "@playwright/test";
import { getGlobal } from "./strapi";

test.use({ viewport: { width: 1280, height: 800 } });

function hrefs(links: Locator) {
  return links.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
}

test("navbar and footer render the links configured in Strapi", async ({
  page,
}) => {
  const { navbar, footer } = await getGlobal();
  await page.goto("/");

  const navLinks = page
    .getByRole("banner")
    .getByRole("listitem")
    .getByRole("link");
  await expect(navLinks).toHaveText(navbar.links.map((link) => link.text));
  expect(await hrefs(navLinks)).toEqual(navbar.links.map((link) => link.url));

  const footerEl = page.locator("footer");

  const menuLinks = footerEl
    .getByText("Menu", { exact: true })
    .locator("xpath=following-sibling::ul[1]//a");
  await expect(menuLinks).toHaveText(footer.menuLinks.map((link) => link.text));
  expect(await hrefs(menuLinks)).toEqual(
    footer.menuLinks.map((link) => link.url),
  );

  const legalLinks = footerEl
    .getByText(/All rights reserved/)
    .locator("xpath=following-sibling::ul[1]/a");
  await expect(legalLinks).toHaveText(
    footer.legalLinks.map((link) => link.text),
  );
  expect(await hrefs(legalLinks)).toEqual(
    footer.legalLinks.map((link) => link.url),
  );

  const socialLinks = footerEl.locator("a[title]");
  expect(
    await socialLinks.evaluateAll((els) =>
      els.map((el) => [
        el.getAttribute("title"),
        el.getAttribute("href"),
        el.getAttribute("target"),
      ]),
    ),
  ).toEqual(
    footer.socialLinks.map((link) => [
      link.text,
      link.url,
      link.newTab ? "_blank" : "_self",
    ]),
  );
});
