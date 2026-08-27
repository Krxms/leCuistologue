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

const fonctionnalitesCommunes = [
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
    ideal: "1 à 2 mangeurs",
    duree: "Environ 2h",
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
    duree: "Environ 4h",
    ponctuelle: { prixPlein: "259 €", prixReduit: "129,50 €" },
    routine: { prixPlein: "229 €", prixReduit: "114,50 €" },
  },
];

export function getFormule(slug: string): Formule | undefined {
  return formules.find((f) => f.slug === slug);
}
