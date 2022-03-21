import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { dynamicImport } from 'vite-plugin-dynamic-import';
import envCompatible from 'vite-plugin-env-compatible';
// import { defineConfig } from 'vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
  },
  plugins: [vue(), nodeResolve(), envCompatible(), dynamicImport()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env,
    ...(process.env.NODE_ENV !== 'test' && { 'process.platform': {} }),
  },
  server: {
    port: 8080,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/\.[jt]sx$/],
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/e2e/**'],
  },
});