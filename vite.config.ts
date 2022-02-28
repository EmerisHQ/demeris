import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { dynamicImport } from 'vite-plugin-dynamic-import';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env,
    global: {},
  },
  plugins: [vue(), nodeResolve(), envCompatible(), dynamicImport()],
  server: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      less: {
        rootpath: 'http://localhost:8080/src',
      },
      scss: {
        rootpath: 'http://localhost:8080/src',
      },
    },
  },
});
