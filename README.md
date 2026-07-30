# Le Cuistologue — site vitrine (Astro)

## Démarrer en local

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:4321

## Build de production

```bash
npm run build
npm run preview   # pour vérifier le build localement avant déploiement
```

## État actuel

- **Page d'accueil (`/`)** : construite, 100% statique, aucune dépendance à WordPress.
  Toutes les sections (Hero, Présentation, Valeurs, Comment ça marche, Offre,
  Témoignages) sont dans `src/components/sections/`.
- Les zones marquées `photo-placeholder` (dégradé pêche/sauge) attendent les
  vrais visuels du client — à remplacer par de vraies images dans
  `public/images/` puis des balises `<img>`, ou via `astro:assets` pour
  l'optimisation automatique.
- Les pages **Formules**, **À propos**, **Avance immédiate**, **FAQ**,
  **Contact** ne sont pas encore créées — elles suivront une fois l'accueil
  validé. Formules et FAQ se connecteront à WordPress via WPGraphQL
  (voir le didacticiel de configuration fourni séparément).

## Palette et typographies (définies dans `src/styles/global.css`)

- `--color-cream` #FBF6EC — fond général
- `--color-peach` #F4D8B8 — sections Hero / Footer
- `--color-sage` #B9C49E — bandeau valeurs
- `--color-pink` #F4CFC8 — section offre
- `--color-forest` #2E3A2C — texte fort, boutons, logo
- `--color-gold` #C9963D — accents (étoiles, pointillés)
- Titres : **Fredoka** (`font-display`) — Accents : **Fraunces italique** (`font-accent`) — Texte courant : **Inter**

## Animations

Révélation douce au scroll (`.reveal`, script dans `BaseLayout.astro`),
respecte `prefers-reduced-motion`. Pas d'animation lourde, conformément au
besoin exprimé ("animations très légères").
