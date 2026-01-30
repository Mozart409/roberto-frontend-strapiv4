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

  // In a CMS-driven architecture with catch-all routing,
  // unknown routes render the not-found page with 200 status
  // because the route pattern matches (catch-all) even though content doesn't exist
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("404 Content not found!");
});
