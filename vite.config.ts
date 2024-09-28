/// <reference types="vitest" />
import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import pkgJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@test': '/test',
    },
  },
  build: {
    target: 'esnext',
    manifest: true,
    minify: true,
    emptyOutDir: true,
    sourcemap: false,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [...Object.keys(pkgJson.peerDependencies), 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      plugins: [
        typescript({
          outDir: 'dist',
          declaration: true,
          exclude: ['test/**/*', 'playground/**/*'],
        }),
      ],
    },
  },
});
