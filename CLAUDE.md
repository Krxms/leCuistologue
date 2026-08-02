## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# CLAUDE.md — Le Cuistologue

## Development

When starting the dev server, use background mode:
`npm run dev &` (ou équivalent Windows) pour ne pas bloquer le terminal.

## Contexte du projet

Site vitrine WordPress headless (WPGraphQL + ACF) → Astro → Cloudflare Workers
(assets statiques uniquement, pas de SSR).

6 pages réelles : Accueil (/), Formules (/formules), À propos (/a-propos),
Avance immédiate (/avance-immediate), FAQ (/faq), Contact (/contact).
"Comment ça marche" n'est PAS une page — c'est une section ancrée sur l'Accueil
(id="comment-ca-marche"), liée depuis la nav via /#comment-ca-marche (jamais
juste #comment-ca-marche, sinon le lien casse depuis les autres pages).

## Quelle page a besoin de WordPress/GraphQL, et laquelle non

- Accueil : 100% statique, hardcodé, AUCUNE donnée WordPress.
- Formules : dynamique — CPT `formule` (title natif = nom de la formule,
  champs `prix`, `description`, `prestations`) + galerie photo sur la
  Page Formules elle-même, pas sur le CPT (`formulesGalerieFields.photos`).
- À propos : dynamique — contenu natif WordPress (title + content), pas
  de champ ACF.
- Avance immédiate : statique.
- FAQ : dynamique — CPT `question` (title natif = question, content
  natif = réponse).
- Contact : statique + formulaire (mécanisme séparé, pas encore
  implémenté — Cloudflare Worker function + service d'envoi d'email,
  deux emails à chaque soumission : notification au client + confirmation
  au prospect).
- Header/Footer : Page d'options ACF (`optionsFields`), interrogée une
  seule fois dans BaseLayout.astro, jamais dupliquée par page.

## Endpoint WordPress

- GraphQL : https://cms.lecuistologue.fr/graphql
- Variable d'env : WORDPRESS_GRAPHQL_ENDPOINT (définie dans Cloudflare
  Settings > Build > Variables and secrets, PAS dans un .env committé)
- Fetch centralisé dans src/lib/wordpress.ts (fonction fetchGraphQL)
- Requêtes GraphQL dans src/lib/queries/, une par page/besoin

## Conventions de nommage — strictes, ne pas dévier

- Tous les dossiers en minuscules, sans accent, sans espace
  (accueil, formules, apropos, faq, avance-immediate) — évite les bugs
  de casse Windows/Linux au déploiement Cloudflare.
- components/sections/<page>/NomDuComposant.astro — un sous-dossier
  par page.
- styles/sections/<page>/nom-du-composant.css — miroir exact de
  components/, un fichier CSS par composant. Classes préfixées par
  section (ex. .hero__title, .offre__cta) pour éviter les collisions,
  puisque ces CSS ne sont PAS scoped automatiquement (contrairement à
  un bloc <style> Astro classique).
- assets/<page>/nom-image.jpg — via astro:assets et le composant
  <Image>, sauf public/ réservé aux fichiers servis tels quels
  (favicon, robots.txt).
- Les fichiers dans pages/ restent de simples assembleurs : ils
  importent les sections et les composent dans l'ordre, sans gros bloc
  de HTML écrit directement dedans.

## Style

- Tailwind CSS v4 (config via @theme dans src/styles/global.css,
  pas de tailwind.config.js séparé).
- Palette et typographies : variables CSS dans global.css. Ne jamais
  coder une couleur en dur, toujours var(--color-xxx) ou la classe
  Tailwind correspondante.
- Préférence affirmée : CSS séparé (styles/sections/) plutôt que
  classes utilitaires Tailwind inline, pour les composants qui
  demandent beaucoup d'ajustement de placement et de media queries.
- Seuil responsive mobile → desktop : 768px partout, ne pas varier
  d'une section à l'autre.
- Animations : très légères uniquement (fade-in au scroll via la
  classe .reveal), jamais d'animation lourde. Respecter
  prefers-reduced-motion.

## Déploiement

- Repo GitHub : Krxms/leCuistologue (package.json à la racine du repo,
  pas de dossier imbriqué).
- Cloudflare Worker "lecuistologue", assets statiques uniquement.
  wrangler.jsonc committé volontairement pour empêcher Cloudflare
  d'auto-ajouter l'adaptateur SSR @astrojs/cloudflare au déploiement.
- Build command: npm run build — Output directory: dist
- Rebuild : push GitHub → déploiement automatique. Pas encore de
  webhook WordPress → Cloudflare pour rebuild à la publication (à
  faire si le rythme de publication du client le justifie).

## Piège connu, déjà rencontré une fois — ne pas reproduire

Un sous-domaine WordPress.com connecté (cms.lecuistologue.fr) doit être
désigné comme "adresse principale" du site DÈS sa connexion. Sinon,
toute requête vers ce sous-domaine (wp-admin, /graphql, Jetpack) est
automatiquement redirigée vers l'ancien domaine principal — qui pointe
maintenant vers le site Astro, pas WordPress. Symptôme : 404 partout
côté WordPress alors que le DNS lui-même est correct.