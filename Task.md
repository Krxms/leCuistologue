Simplifie la section Presentation de la page d'accueil : remplace le photo
montage en couches (masque CSS + anneau + photo séparés) par une seule image
composite déjà assemblée par Figma. C'est un changement délibéré pour fiabiliser
le rendu, pas une régression — ne réintroduis pas l'ancien système à quatre
couches.

ÉTAPE 1 — Télécharger la nouvelle image composite
mkdir -p src/assets/accueil/presentation
curl.exe -L -o src/assets/accueil/presentation/chef-composite.png "https://www.figma.com/api/mcp/asset/a9f3d94b-38d1-46a1-b8f1-ef41be8045f6.png"

Vérifie que le fichier existe et fait plus de 0 octet.

ÉTAPE 2 — Supprimer les fichiers devenus inutiles
Supprime, s'ils existent :
- src/assets/accueil/presentation/chef-photo.png
- src/assets/accueil/presentation/chef-ring.svg
- public/images/accueil/chef-mask.svg

ÉTAPE 3 — Simplifier src/components/sections/accueil/Presentation.astro
Remplace le bloc <div class="presentation__photo-wrap"> actuel (qui contient
chefRing + presentation__photo-mask + Image chefPhoto) par ceci uniquement :

  <div class="presentation__photo-wrap">
    <Image src={chefComposite} alt="Le chef du Cuistologue en cuisine" class="presentation__photo" />
    <img src={chefContainer.src} alt="" class="presentation__photo-deco" aria-hidden="true" />
  </div>

Retire les imports devenus inutiles (chefPhoto, chefRing) et ajoute :
  import chefComposite from "../../../assets/accueil/presentation/chef-composite.png";

Garde tel quel le reste du fichier (bridgeArrow, titleIcon, le texte, le CTA,
squiggle, underline, chefContainer).

ÉTAPE 4 — Simplifier src/styles/sections/accueil/presentation.css
Supprime entièrement les règles .presentation__photo-ring et
.presentation__photo-mask (elles n'ont plus d'élément associé).
Remplace .presentation__photo par :

  .presentation__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

Garde .presentation__photo-wrap tel quel (position, left, top, width,
aspect-ratio ne changent pas — l'image composite occupe exactement la même
zone que l'ancien montage en couches).

ÉTAPE 5 — Vérification
Redémarre le serveur (astro dev stop puis astro dev --background), attends le
démarrage, vérifie l'absence d'erreur (astro dev logs). Confirme "Terminé,
aucune erreur" ou liste précisément ce qui bloque.