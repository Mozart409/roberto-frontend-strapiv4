import { expect, test } from "@playwright/test";

test("robots.txt is served", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain("User-agent:");
});

test("svg asset is served", async ({ request }) => {
  const response = await request.get("/next.svg");

  expect(response.ok()).toBe(true);
  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("image/svg+xml");
});

test("png asset is served", async ({ request }) => {
  const response = await request.get("/check32.png");

  expect(response.ok()).toBe(true);
  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("image/png");
});

test("unknown route shows not found content", async ({ request }) => {
  const response = await request.get("/missing-route-123");

  // CMS pages are prerendered with `dynamicParams = false`, so a slug that
  // isn't in Strapi is a real 404 rather than an on-demand render.
  expect(response.status()).toBe(404);
  const body = await response.text();
  expect(body).toContain("Seite nicht gefunden");
});
