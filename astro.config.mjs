// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';

/**
 * Date de dernière modification réelle d'une page : date du dernier commit touchant
 * ses fichiers sources (Git). Repli : date du build si Git est indisponible.
 */
function fichiersSourcesPourRoute(pathname) {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/') return ['src/pages/index.astro', 'src/components/sections/accueil'];
  if (p.startsWith('/cuisinier-a-domicile-')) {
    return [
      'src/pages/cuisinier-a-domicile-[departement].astro',
      'src/components/sections/zone/ZoneDepartement.astro',
      'src/lib/site-data.ts',
    ];
  }
  if (p.startsWith('/journal/')) return ['src/pages/journal', 'src/content'];
  return [`src/pages${p}.astro`, 'src/components'];
}

function dateModificationGit(pathname, dateBuild) {
  try {
    const sortie = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...fichiersSourcesPourRoute(pathname)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return sortie || dateBuild;
  } catch {
    return dateBuild;
  }
}

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
      // lastmod = date réelle de modification (Git), jamais la date du build : une date identique
      // pour toutes les URL n'a aucune valeur pour Google.
      serialize(item) {
        const dateBuild = new Date().toISOString();
        item.lastmod = dateModificationGit(new URL(item.url).pathname, dateBuild);
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