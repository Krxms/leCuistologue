export interface Formule {
  slug: string;
  titre: string;
  accroche: string;
  ideal: string;
  fonctionnalites: string[];
  resultat: string;
  duree: string;
  prixPlein: string;
  prixReduit: string;
  suffixePrix: string;
  mention?: string;
  misEnAvant?: boolean;
}

export const formules: Formule[] = [
  {
    slug: "essentielle",
    titre: "L'Essentielle",
    accroche: "Une première expérience simple pour retrouver le plaisir d'une cuisine maison.",
    ideal: "1 à 2 personnes",
    fonctionnalites: [
      "Échange préalable sur vos habitudes et vos envies",
      "Élaboration du menu de la semaine",
      "Confection de la liste des courses",
      "Préparation de plusieurs repas à domicile",
      "Étiquetage et organisation dans votre réfrigérateur",
      "Conseils de conservation et de réchauffage",
      "Nettoyage de la cuisine après intervention",
    ],
    resultat: "Vos repas de la semaine sont prêts et votre frigo est organisé (environ 10 à 15 repas individuels selon les recettes choisies et les habitudes du foyer).",
    duree: "Environ 2h (selon le menu choisi)",
    prixPlein: "149 €",
    prixReduit: "74,50 €",
    suffixePrix: "/ intervention",
  },
  {
    slug: "serenite",
    titre: "La Sérénité",
    misEnAvant: true,
    accroche: "La solution préférée des familles, des actifs débordés et des aînés.",
    ideal: "2 à 4 personnes",
    fonctionnalites: [
      "Échange préalable sur vos habitudes, vos envies et votre organisation",
      "Élaboration du menu de la semaine",
      "Confection de la liste des courses",
      "Adaptation aux préférences alimentaires de chaque membre du foyer",
      "Préparation de plusieurs repas directement dans votre cuisine",
      "Étiquetage et organisation dans votre réfrigérateur",
      "Conseils de conservation et de réchauffage",
      "Remise au propre de la cuisine après intervention",
    ],
    resultat: "Vos repas de la semaine sont prêts et votre frigo est organisé (environ 20 à 25 repas individuels selon les recettes choisies et les habitudes du foyer).",
    duree: "Environ 3h (selon le menu choisi)",
    prixPlein: "189 €",
    prixReduit: "94,50 €",
    suffixePrix: "/ intervention",
  },
  {
    slug: "routine",
    titre: "La Routine du Cuistologue",
    accroche: "Une année de cuisine maison, sans avoir à y penser.",
    ideal: "Les foyers qui souhaitent installer durablement une routine de cuisine maison",
    fonctionnalites: [
      "15 interventions réparties librement sur l'année",
      "Échange préalable pour adapter chaque intervention aux envies, aux saisons et aux contraintes du moment",
      "Élaboration du menu de la semaine",
      "Confection de la liste des courses",
      "Adaptation aux préférences alimentaires de chaque membre du foyer",
      "Préparation de plusieurs repas directement dans votre cuisine",
      "Étiquetage et organisation dans votre réfrigérateur",
      "Conseils de conservation et de réchauffage",
      "Remise au propre de la cuisine après chaque intervention",
    ],
    resultat: "Vos repas de la semaine sont prêts et votre frigo est organisé (environ 20 à 25 repas individuels selon les recettes choisies et les habitudes du foyer).",
    duree: "Environ 3h par intervention",
    prixPlein: "169 €",
    prixReduit: "84,50 €",
    suffixePrix: "/ intervention",
    mention: "Jusqu'à 300 € d'économies sur l'année.",
  },
];

export function getFormule(slug: string): Formule | undefined {
  return formules.find((f) => f.slug === slug);
}