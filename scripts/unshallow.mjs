// Récupère l'historique Git complet avant le build.
// Pourquoi : l'hébergeur clone le dépôt de façon superficielle (un seul commit). Dans ce cas, `git log -- <fichier>` renvoie toujours ce commit,
// et le <lastmod> de toutes les pages du sitemap prend la même date (celle du dernier déploiement). Avec l'historique complet, chaque page garde la
// date de son dernier vrai changement (voir astro.config.mjs). Sans réseau ou sans Git, on continue : le build ne doit jamais échouer pour ça.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

try {
  if (git('rev-parse', '--is-shallow-repository') === 'true') {
    git('fetch', '--unshallow', '--quiet');
    console.log('[unshallow] historique Git complet récupéré (dates de modification du sitemap)');
  }
} catch {
  console.log("[unshallow] historique Git indisponible : les dates du sitemap retombent sur la date du build");
}
