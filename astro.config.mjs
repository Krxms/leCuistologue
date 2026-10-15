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
  // Politique de contenu (CSP) : Astro signe (hash) chaque script et style du site ; seuls ces contenus et les hôtes listés peuvent s'exécuter. Un script injecté par un tiers est bloqué par le navigateur.
  // Hôtes autorisés : Google Analytics (après consentement, voir CookieConsent.astro) et Cloudflare Turnstile (anti-spam des formulaires).
  // frame-ancestors (anti-intégration) ne s'applique pas via <meta> : il est posé dans public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com",
        "font-src 'self'",
        "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          // Attributs style="…" présents dans le HTML (cartes, bandeaux) : les hashes ne peuvent pas les couvrir.
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
      scriptDirective: {
        resources: ["'self'", "https://www.googletagmanager.com", "https://challenges.cloudflare.com"],
      },
    },
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