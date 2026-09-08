// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lecuistologue.fr',
  build: {
    // Injecte tout le CSS des pages en <style> dans le <head> plutôt
    // qu'en <link rel="stylesheet"> : supprime les ressources bloquant
    // le rendu et 2 requêtes HTTP. Le CSS total du site est léger
    // (~12 Ko), le surcoût par page est négligeable et le HTML gzip
    // très bien. Bonus : les media queries se retrouvent dans le HTML,
    // ce que certains auditeurs SEO exigent pour valider le responsive.
    inlineStylesheets: 'always',
  },
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