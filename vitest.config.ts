import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(new URL(import.meta.url)));

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    coverage: {
      reporter: ["text", "html"],
    },
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": resolve(rootDir, "./"),
    },
  },
});
