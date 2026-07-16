import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'og.png', 'llms.txt'],
      manifest: {
        name: 'Todos los goles de Messi',
        short_name: 'Goles Messi',
        description:
          'Reviví los 919 goles de Lionel Messi (2005–2026) en video. Buscá por fecha, club, rival o número.',
        theme_color: '#1fc3e7',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'es',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2}'],
        navigateFallbackDenylist: [/^\/goal\//, /^\/sitemap\.xml$/, /^\/llms\.txt$/, /^\/robots\.txt$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/messi\.aws\.porracin\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'messi-videos-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 9001,
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
