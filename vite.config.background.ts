import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
