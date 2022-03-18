import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/\.[jt]sx$/],
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/e2e/**'],
  },
});
