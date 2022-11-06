import { defineConfig } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './client',
  build: {
    outDir: '../build',
    sourcemap: true,
  },
  esbuild: {
    loader: 'tsx',
    exclude: '*.test.js',
    target: '',
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://saldo-backend:3033',
        changeOrigin: false,
      },
    },
  },
})
