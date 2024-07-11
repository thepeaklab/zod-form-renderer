/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@src": "/src",
      "@test": "/test",
    },
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
          exclude: ["test/**/*", "playground/**/*"],
        }),
      ],
    },
  },
});
