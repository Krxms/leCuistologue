# Contenu éditable (WordPress + ACF)

Le site lit WordPress (`https://cms.lecuistologue.fr/graphql`) à chaque build, via `src/lib/contenu.ts`.
Règle : **champ vide, type absent ou WordPress injoignable = le texte actuel du site s'affiche** (valeurs par défaut dans le dépôt). Le build ne peut pas casser à cause de WordPress.

Publication : un cron Cloudflare (`*/15 * * * *`, `worker/index.ts`) compare la liste des contenus publiés. S'il change (ajout, édition, brouillon, suppression), il déclenche un build. Délai de mise en ligne : environ 15 minutes + durée du build.

## Types de contenu (extension ACF, Show in GraphQL activé)

| Type | Slug | GraphQL (singulier / pluriel) | Supports | Usage |
|---|---|---|---|---|
| Formules | `formule` | `formule` / `formules` | titre, attributs de page (ordre) | cartes de la page Formules et récapitulatif de /reserver |
| Options | `option_formule` | `option` / `options` | titre, attributs de page (ordre) | « Les petits plus » et cases à cocher de /reserver |
| Prestations | `prestation` | `prestation` / `prestations` | titre, attributs de page (ordre) | liste à puce « Chaque intervention est composée de » (accueil) |
| Questions | `question` | `question` / `questions` | titre, attributs de page (ordre) | FAQ |

Pas de répéteur ACF (réservé à ACF Pro) : toute liste = un type de contenu. Ordre d'affichage = « Ordre » (attributs de page). Masquer = passer en **brouillon**. Supprimer = corbeille.

## Groupes de champs

Nom GraphQL du groupe entre parenthèses. Les noms de champs en camelCase sont ceux attendus par le code.

### Page « Accueil » (`/accueil/`) → `accueilValeursEtOffre`
`valeursTitre`, `valeursTitreAccent` (partie colorée), `valeur1Titre`, `valeur1Texte` … `valeur4Titre`, `valeur4Texte`,
`offreTitre`, `offreTitreAccent`, `offreAccroche` (phrase en gras), `offreChapeau` (zone de texte : un paragraphe = une ligne vide),
`offreListeTitre`, `offrePrixLabel` (« À partir de »), `offrePrixValeur` (« 74,50 € »), `offrePrixUnite` (« / intervention »),
`offrePromoAfficher` (vrai/faux : masque l'offre de lancement), `offrePromoTexte` (`**gras**` accepté).

### Page « Accueil » : haut de page → `accueilHautDePage`
`heroTitreDebut`, `heroTitreAccent`, `heroTitreFin` (le signe | = retour à la ligne sur téléphone), `heroDescription` (chapô), `heroBoutonPrincipal`, `heroBoutonSecondaire`, `heroZone`,
`presentationTitre`, `presentationAccroche`, `presentationTexte`, `presentationItalique`, `presentationBouton`.

### Page « Accueil » : bas de page → `accueilBasDePage`
`cmTitre`, `cmTitreAccent`, `cmSousTitre`, `cmEtape1Titre`/`cmEtape1Texte` … `cmEtape3Titre`/`cmEtape3Texte` (« Comment ça marche »),
`temoignagesTitre`, `temoignagesTitreAccent`, `temoignagesMessageVide` (les avis eux-mêmes viennent de Google),
`zoneTitre`, `zoneTexte`, `zoneNote`, `zoneNoteLien`, `zoneBouton` (la liste des 4 départements reste dans `site-data.ts`).

### Page « Le Cuistologue » (`/le-cuistologue/`, page À propos) → `pageAPropos`
`titre`, `sousTitre`, puis pour n = 1 à 5 : `petale{n}Titre`, `petale{n}Contenu` (paragraphes séparés par une ligne vide), `petale{n}Accroche` (phrase mise en valeur).
Pétales dans l'ordre : le métier, la terre, la créativité, le lien social, la transmission.

### Formule → `champsFormule`
`portions` (« 3 à 4 plats · 2 à 3 personnes »), `duree`, `ponctuelPrixPlein`, `ponctuelPrixReduit`, `routinePrixPlein`, `routinePrixReduit`, `misEnAvant` (vrai/faux).
Prix après crédit d'impôt vide = la moitié du prix plein. L'**adresse** (slug) de la formule sert dans `/reserver/?formule=<slug>` : ne pas la modifier une fois publiée.

### Formule : ce qui est inclus → `contenuFormule`
`inclus` : un élément par ligne, affiché dans le récapitulatif de /reserver/.

### Option → `champsOption`
`labelFormulaire`, `prix` (« 20 € »), `prixReduit`, `corps` (paragraphes séparés par une ligne vide, `**gras**` accepté), `precision` (note en gras sous la description), `carte` (choix : `course`, `popote`, `gourmande` = visuel de la carte).

### Question → `champsQuestion`
`reponse` (éditeur visuel : paragraphes, listes, liens). Le titre est la question.

### Article (type natif « Articles ») → `champsArticle`
`seoTitre`, `seoDescription` (facultatifs, 160 caractères maximum). Le titre, le contenu, l'extrait et la date viennent de l'article.

## Journal

Les articles publiés dans WordPress (`/journal/<adresse>/`) s'ajoutent aux fichiers Markdown de `src/content/journal/`. Même adresse = WordPress l'emporte. Les images du corps doivent venir de la médiathèque WordPress (autorisées par la CSP : `cms.lecuistologue.fr`, `*.wp.com`).

## Piège connu : valeurs par défaut

Un champ jamais enregistré renvoie sa valeur par défaut, mais WordPress y remplace les sauts de ligne par des espaces. `estLeDefaut()` (`src/lib/cms.ts`) reconnaît ce cas et garde alors le texte du dépôt. Dès que le propriétaire enregistre le champ, la valeur saisie (avec ses paragraphes) est utilisée.
