import { expect, test } from "@playwright/test";
import { getGlobal } from "./strapi";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile menu lists the Strapi links, closes, and navigates", async ({
  page,
}) => {
  const { navbar } = await getGlobal();
  const target = navbar.links.find(
    (link) => link.url.startsWith("/") && link.url !== "/",
  );
  expect(target, "Strapi navbar has no internal link besides /").toBeDefined();
  if (!target) return;

  await page.goto("/");
  // The Headless UI dialog root has no box of its own (its panel is fixed),
  // so check the links inside it and whether the dialog is mounted at all.
  const menu = page.getByRole("dialog");
  const menuLinks = menu.getByRole("link");
  const openButton = page.getByRole("button", { name: "Open menu" });

  await expect(menu).toHaveCount(0);
  await openButton.click();
  await expect(menuLinks).toHaveText(navbar.links.map((link) => link.text));
  for (const link of await menuLinks.all()) await expect(link).toBeVisible();

  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toHaveCount(0);
  await expect(page).toHaveURL("/");

  await openButton.click();
  await menu.getByRole("link", { name: target.text, exact: true }).click();
  await expect(page).toHaveURL(target.url);
  await expect(menu).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: /Seite nicht gefunden|Etwas ist schiefgelaufen/,
    }),
  ).toHaveCount(0);
});
