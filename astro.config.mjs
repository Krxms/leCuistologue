// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lecuistologue.fr',
  integrations: [
    sitemap({
      // `lastmod` = date du build. Signal de fraîcheur pour les moteurs.
      // Quand un blog alimenté par des dates réelles sera en place, on
      // pourra passer une date par URL ici.
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  },
});