import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE || "/",
  plugins: [tailwindcss(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./test/setupTests.ts",
  },
});
