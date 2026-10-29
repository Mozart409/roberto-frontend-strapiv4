import { expect, test } from "@playwright/test";
import { getPages, pathForSlug } from "./strapi";

test("contact form blocks invalid input and rejects a missing Turnstile token", async ({
  page,
}) => {
  const formPage = (await getPages()).find((p) =>
    p.contentSections?.some((s) => s.__component === "sections.lead-form"),
  );
  expect(formPage, "no Strapi page has a sections.lead-form").toBeDefined();
  if (!formPage) return;

  // Without the widget there is no token, so the server action has to refuse
  // before it reaches Resend. This also keeps the test from sending real mail.
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.abort(),
  );
  const actionPosts: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST" && req.headers()["next-action"]) {
      actionPosts.push(req.url());
    }
  });

  await page.goto(pathForSlug(formPage.slug));
  const form = page.locator("form").filter({ has: page.locator("#message") });
  const submit = form.locator('button[type="submit"]');

  await form.locator("#username").fill("Ada Lovelace");
  await form.locator("#email").fill("not-an-email");
  await form.locator("#subject").fill("E2E test");
  await form.locator("#message").fill("Playwright, please ignore.");
  await submit.click();

  expect(
    await form.evaluate((el) => (el as HTMLFormElement).checkValidity()),
  ).toBe(false);
  await expect(form.locator("#email:invalid")).toHaveCount(1);

  await form.locator("#email").fill("ada@example.com");
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.request().method() === "POST" &&
        !!res.request().headers()["next-action"],
    ),
    submit.click(),
  ]);
  expect(response.status()).toBe(200);

  await expect(
    page.getByText(
      "Die Sicherheitsprüfung ist fehlgeschlagen. Bitte erneut versuchen.",
    ),
  ).toBeVisible();
  // Only the valid submit reached the server; the invalid one was stopped by
  // the browser's constraint validation.
  expect(actionPosts).toHaveLength(1);
});
