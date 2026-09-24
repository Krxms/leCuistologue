// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lecuistologue.fr',
  build: {
    // CSS inlinée dans le <head> : plus de <link> bloquant le rendu (~12 Ko au total, surcoût négligeable).
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // lastmod = date du build ; à remplacer par des dates réelles quand le blog sera en place.
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