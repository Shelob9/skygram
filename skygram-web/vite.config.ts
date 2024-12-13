import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';
import { defineConfig, } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    plugins: [
    TanStackRouterVite(),
    viteReact(),
    createHtmlPlugin({
        minify: isProd,
        entry: 'src/main.tsx',
        template: 'index.html',
        inject: {
          data: {
            title: 'Skygram',
            injectScript: isProd
              ? `<script type="module">window.SKYGRAM = 1;</script>`
              : `<link rel="stylesheet" href="/src/index.css" />`,
          },
          tags: [
            {
              "injectTo": "body-prepend",
              tag: "header",
              attrs:{
                class: `sticky top-0 border-b shadow-sm bg-white z-30`,
                id:`skygram-header`
              }
            },

            {
              injectTo: 'body-prepend',
              tag: 'main',
              attrs: {
                id: 'skygram-main',
                class:`grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-6xl`,
              },
              children: [
                {
                  tag: 'section',
                  attrs: {
                    class: 'md:col-span-2',
                    id: 'skygram-main-section',
                  },
                },{
                  tag: 'aside',
                  attrs:{
                    id: 'skygram-main-aside',
                    class: `md:inline-grid md:col-span-1`,
                  },
                }
              ],
            },

          ],
        },
      }),
    ],

    server: {
      proxy: {
        '/api': 'http://localhost:5100',
      },
    },
  } satisfies UserConfig;
});
