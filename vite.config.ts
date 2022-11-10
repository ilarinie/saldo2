import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './client',
  build: {
    outDir: '../build',
    sourcemap: true,
  },
  plugins: [react(), tsconfigPaths()],
  assetsInclude: ['assets'],
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'http://localhost:3033/ws',
      },
      '/api': {
        target: 'http://localhost:3033',
        changeOrigin: false,
      },
    },
  },
})
