import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 7002,
    strictPort: true,
    open: false
  },
  preview: {
    port: 7002,
    strictPort: true
  }
});
