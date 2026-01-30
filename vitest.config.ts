import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["tests/setup/vitest.ts"],
    include: ["tests/integration/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**/*"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
