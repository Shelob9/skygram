import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
  ],

  server: {
    proxy: {
      '/api': 'http://localhost:5100',
    },
  },

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        feedgen: resolve(__dirname, 'feedgen.html'),
      },
    },
  },
})
