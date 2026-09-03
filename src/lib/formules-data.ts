export interface FormuleTarif {
  prixPlein: string;
  prixReduit: string;
}

export interface Formule {
  slug: string;
  titre: string;
  portions: string;
  fonctionnalites: string[];
  ideal: string;
  duree: string;
  ponctuelle: FormuleTarif;
  routine: FormuleTarif;
  misEnAvant?: boolean;
}

export const fonctionnalitesCommunes = [
  "Échange préalable sur vos habitudes",
  "Élaboration du menu de la semaine",
  "Confection de la liste des courses",
  "Préparation de plusieurs repas à domicile",
  "Étiquetage et organisation des préparations dans votre réfrigérateur",
  "Conseils de conservation et de réchauffage",
  "Nettoyage de la cuisine après intervention",
];

export const formules: Formule[] = [
  {
    slug: "petit-panier",
    titre: "Le Petit Panier",
    portions: "10 à 15 portions de plats, selon les recettes choisies et les habitudes du foyer.",
    fonctionnalites: fonctionnalitesCommunes,
    ideal: "Pour 1 à 2 mangeurs",
    duree: "Environ 2 heures",
    ponctuelle: { prixPlein: "159 €", prixReduit: "79,50 €" },
    routine: { prixPlein: "149 €", prixReduit: "74,50 €" },
  },
  {
    slug: "belle-tablee",
    titre: "La Belle Tablée",
    misEnAvant: true,
    portions: "20 à 25 portions de plats, selon les recettes choisies et les habitudes du foyer.",
    fonctionnalites: fonctionnalitesCommunes,
    ideal: "Jusqu'à 4 mangeurs",
    duree: "Environ 3 heures",
    ponctuelle: { prixPlein: "209 €", prixReduit: "104,50 €" },
    routine: { prixPlein: "189 €", prixReduit: "94,50 €" },
  },
  {
    slug: "grande-recolte",
    titre: "La Grande Récolte",
    portions: "30 à 35 portions de plats, selon les recettes choisies et les habitudes du foyer.",
    fonctionnalites: fonctionnalitesCommunes,
    ideal: "Jusqu'à 6 mangeurs",
    duree: "Environ 4 heures",
    ponctuelle: { prixPlein: "259 €", prixReduit: "129,50 €" },
    routine: { prixPlein: "229 €", prixReduit: "114,50 €" },
  },
];

export function getFormule(slug: string): Formule | undefined {
  return formules.find((f) => f.slug === slug);
}

/* ===== Options « Les petits plus » ==================================
   Source unique pour les 3 options :
     - la section "petits plus" de la page Formules (composant
       PetitsPlus.astro) : titre, prix, `corps` rendu tel quel (HTML) ;
     - les infobulles du formulaire /reserver (où l'on coche les
       options) : `labelFormulaire`, prix, `corps` en texte brut.
   `slug`  = valeur de la case à cocher côté formulaire.
   `carte` = suffixe des classes CSS (.petits-plus-card--<carte>) et
             clé du fond SVG dans PetitsPlus.astro.
   ================================================================== */

export interface OptionPetitPlus {
  slug: string;
  carte: "course" | "popote" | "gourmande";
  titre: string;
  /** Libellé de la case à cocher sur /reserver (plus explicite). */
  labelFormulaire: string;
  /** Tarif de l'option, ex. "20 €". */
  prix: string;
  /** Tarif après crédit d'impôt, ex. "10 €". */
  prixReduit: string;
  /**
   * Corps de la description. Peut contenir <br>, <b>, <i> : rendu tel
   * quel sur la carte "petits plus", réduit en texte brut dans
   * l'infobulle /reserver.
   */
  corps: string;
  /** Précision éventuelle : mise en <i> sur la carte, en note dans l'infobulle. */
  precision?: string;
}

export const optionsPetitsPlus: OptionPetitPlus[] = [
  {
    slug: "courses",
    carte: "course",
    titre: "Courses",
    labelFormulaire: "Courses réalisées pour vous",
    prix: "20 €",
    prixReduit: "10 €",
    corps:
      "Je sélectionne et achète pour vous les produits nécessaires à vos menus auprès des commerces et producteurs adaptés, puis je les apporte directement à votre domicile.",
    precision:
      "Le tarif de 20 € rémunère uniquement ce service : le montant des produits achetés reste à votre charge.",
  },
  {
    slug: "popotes",
    carte: "popote",
    titre: "Popotes à emporter",
    labelFormulaire: "Popotes à emporter",
    prix: "4 €",
    prixReduit: "2 €",
    corps:
      "Des repas maison prêts à être emportés au travail, à l’école ou ailleurs…",
  },
  {
    slug: "reserve-gourmande",
    carte: "gourmande",
    titre: "Réserve gourmande",
    labelFormulaire: "Réserve gourmande",
    prix: "10 €",
    prixReduit: "5 €",
    corps:
      "Une préparation maison supplémentaire ou plusieurs petites préparations que l’on sélectionne ensemble.<br><br>Pour les goûters, petits-déjeuners ou petites faims : <b>granola, compotes, gâteaux, biscuits, tartinades, etc.</b>",
  },
];
