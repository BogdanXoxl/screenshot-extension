import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/content.ts"),
      name: "ContentScript",
      formats: ["iife"],
      fileName: () => "content.js", // без хэшей
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // всё в один файл
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
