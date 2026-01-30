import { expect, test } from "@playwright/test";

test("api hello returns expected payload", async ({ request }) => {
  const response = await request.get("/api/hello");

  expect(response.ok()).toBe(true);

  const payload = await response.json();

  expect(payload).toEqual({ data: { msg: "Hello World" } });
});
