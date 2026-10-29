import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

// Specs query Strapi directly, so give them the env Next reads. Existing vars
// (CI) win, and .env.local wins over .env as in Next.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
  webServer: {
    command: "next build && next start -H 0.0.0.0 -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
