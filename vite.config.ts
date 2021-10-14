import { defineConfig } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import react from 'vite-preset-react'

export default defineConfig({
  root: './client',
  build: {
    outDir: './build',
    sourcemap: true,
  },
  plugins: [
    react({
      reactRefreshOptions: {
        include: './client'
      }
    }),
    envCompatible(),
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
