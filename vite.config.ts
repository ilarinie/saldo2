import { defineConfig } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import svgr from 'vite-plugin-svgr';
import react from 'vite-preset-react';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [react(), svgr(), envCompatible()],
  server: {
    proxy: {
      '/api': {
        target: 'http://saldo-backend:3033',
        changeOrigin: false,
      },
    },
  },
});
