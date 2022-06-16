import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import dynamicImport from 'vite-plugin-dynamic-import';
import envCompatible from 'vite-plugin-env-compatible';
import eslintPlugin from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

import gitVersion from './build/git-version';
import * as pkg from './package.json';

// https://vitejs.dev/config/
// eslint-disable-next-line max-lines-per-function
export default () => {
  // Do Node stuff here:
  process.env.VITE_GIT_VERSION = gitVersion();
  process.env.VITE_VERSION = pkg.version;
  return defineConfig({
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
    plugins: [vue(), nodeResolve(), dynamicImport(), envCompatible(), eslintPlugin({ fix: true })],
    resolve: {
      alias: {
        '@starport/vuex': path.resolve(__dirname, './src/utils/EmerisError.ts'),
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.vue', '.js', '.json', '.tsx'],
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
      setupFiles: './tests/setup',
      deps: {
        inline: ['@vespaiach/axios-fetch-adapter'],
      },
      transformMode: {
        web: [/\.[jt]sx$/],
      },
      exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    },
  });
};
