/* Identité du site : source unique NAP + zones + réseaux (cohérence NAP = signal SEO local). Ne pas redéfinir ces valeurs ailleurs. */

export const site = {
  name: "Le Cuistologue",
  legalName: "Bruno Pereira Vaz",
  founder: "Bruno Pereira Vaz",
  url: "https://lecuistologue.fr",
  /** Baseline courte, réutilisée dans les balises meta. */
  tagline:
    "Cuisinier à domicile spécialiste de la cuisine du quotidien, dans le Vexin et ses alentours.",

  email: "contact@lecuistologue.fr",
  phone: {
    /** Affichage humain. */
    display: "06 12 77 62 64",
    /** href tel: au format international. */
    href: "tel:+33612776264",
    /** Format E.164 pour les données structurées. */
    e164: "+33612776264",
  },

  /** Localisation publique : ville et zone seulement, jamais l'adresse précise (domicile privé) ; l'adresse complète figure sur les pages légales. */
  location: {
    city: "Serans",
    region: "Oise",
    countryCode: "FR",
  },

  /** SIRET / déclaration Services à la personne. */
  siret: "10163002800013",
  siren: "101 630 028",

  /**
   * Zones desservies. `communes` : liste validée par le client, ne pas la compléter sans son accord.
   * slug / prep / de : URL /cuisinier-a-domicile-<slug>, « dans l'Oise », « de l'Oise ».
   * intro / pitch / noteIntro / metaDesc : textes propres à chaque page, à rédiger réellement
   * différemment (pas un gabarit où seul le nom change : contenu dupliqué).
   */
  areas: [
    {
      name: "Oise",
      code: "60",
      slug: "oise",
      prep: "l'Oise",
      de: "de l'Oise",
      secteur: "Vexin-Thelle",
      communes: ["Beauvais", "Chaumont-en-Vexin", "Méru", "Trie-Château", "Auneuil", "Noailles"],
      intro:
        "Le Cuistologue est installé dans l'Oise et intervient sur le secteur du Vexin-Thelle : Beauvais, Chaumont-en-Vexin, Méru, Trie-Château, Auneuil, Noailles et les communes voisines.",
      pitch:
        "C'est le département où Bruno vit et cuisine au quotidien : les disponibilités y sont généralement les plus larges, et les déplacements les plus courts. Le fonctionnement reste simple — une intervention chez vous pour préparer plusieurs repas de la semaine, à partir de vos habitudes et, si besoin, de courses faites pour vous, réfrigérateur rangé et cuisine remise en ordre à la fin.",
      noteIntro:
        "Votre commune de l'Oise n'apparaît pas dans la liste ?",
      metaDesc:
        "Cuisinier à domicile dans l'Oise, secteur Vexin-Thelle : Beauvais, Chaumont-en-Vexin, Méru, Trie-Château, Auneuil, Noailles. Repas préparés chez vous.",
    },
    {
      name: "Val-d'Oise",
      code: "95",
      slug: "val-doise",
      prep: "le Val-d'Oise",
      de: "du Val-d'Oise",
      secteur: "Vexin français et vallée de l'Oise",
      communes: ["Cergy", "Pontoise", "Magny-en-Vexin", "Marines", "Vigny", "Chars", "L'Isle-Adam", "Persan", "Beaumont-sur-Oise"],
      intro:
        "Dans le Val-d'Oise, Le Cuistologue intervient sur le Vexin français et la vallée de l'Oise : Cergy, Pontoise, Magny-en-Vexin, Marines, Vigny, Chars, L'Isle-Adam, Persan, Beaumont-sur-Oise.",
      pitch:
        "Le Vexin français prolonge directement le secteur où Bruno est installé dans l'Oise, ce qui permet d'intervenir aussi bien du côté de Cergy et Pontoise que sur les communes plus rurales de la vallée de l'Oise. Le principe est identique partout : une seule intervention à domicile pour cuisiner plusieurs repas d'avance, avec la possibilité de confier les courses, et une cuisine laissée propre en repartant.",
      noteIntro:
        "Votre commune du Val-d'Oise n'est pas citée ici ?",
      metaDesc:
        "Cuisinier à domicile dans le Val-d'Oise : Cergy, Pontoise, Magny-en-Vexin, Marines, Vigny, Chars, L'Isle-Adam, Persan, Beaumont-sur-Oise.",
    },
    {
      name: "Yvelines",
      code: "78",
      slug: "yvelines",
      prep: "les Yvelines",
      de: "des Yvelines",
      secteur: "Mantois",
      communes: ["Mantes-la-Jolie", "Mantes-la-Ville", "Limay", "Houdan", "Septeuil", "Bonnières-sur-Seine"],
      intro:
        "Dans les Yvelines, Le Cuistologue intervient sur le Mantois : Mantes-la-Jolie, Mantes-la-Ville, Limay, Houdan, Septeuil, Bonnières-sur-Seine.",
      pitch:
        "Le Mantois, en bordure de Seine, complète naturellement la zone couverte à l'ouest des Yvelines. Chaque intervention se déroule chez vous, en une seule fois : les menus sont définis ensemble, les courses peuvent être prises en charge, puis les repas de la semaine sont préparés et rangés dans un réfrigérateur organisé.",
      noteIntro:
        "Une commune des Yvelines proche du Mantois ne figure pas ici ?",
      metaDesc:
        "Cuisinier à domicile dans les Yvelines, secteur du Mantois : Mantes-la-Jolie, Mantes-la-Ville, Limay, Houdan, Septeuil, Bonnières-sur-Seine.",
    },
    {
      name: "Eure",
      code: "27",
      slug: "eure",
      prep: "l'Eure",
      de: "de l'Eure",
      secteur: "Vexin normand",
      communes: ["Vernon", "Gisors", "Étrépagny", "Les Andelys", "Écos", "Gasny"],
      intro:
        "Dans l'Eure, Le Cuistologue intervient sur le Vexin normand : Vernon, Gisors, Étrépagny, Les Andelys, Écos, Gasny.",
      pitch:
        "Le Vexin normand fait la jonction entre l'Oise et l'Eure, un territoire que Bruno couvre régulièrement. Le fonctionnement y est le même que partout ailleurs : une intervention à domicile pour cuisiner les repas de la semaine, courses possibles en amont, puis cuisine et réfrigérateur remis en ordre avant de repartir.",
      noteIntro:
        "Votre commune de l'Eure n'y figure pas ?",
      metaDesc:
        "Cuisinier à domicile dans l'Eure, secteur du Vexin normand : Vernon, Gisors, Étrépagny, Les Andelys, Écos, Gasny.",
    },
  ],

  /** Fourchette de prix (formules 149 € – 259 €). */
  priceRange: "€€",

  /** Profils officiels (`sameAs`, footer). Vide tant que les URL ne sont pas connues. */
  social: [] as { label: string; url: string }[],

  /** Image OpenGraph (dans /public), 1200×630. */
  ogImage: "/og-image.png",

  /** Codes de vérification webmasters (valeur `content` de la balise) ; vide = balise non rendue. */
  verification: {
    google: "", // Google Search Console — <meta name="google-site-verification" content="…">
    bing: "", // Bing Webmaster Tools — <meta name="msvalidate.01" content="…">
  },
};

/** "Oise, le Val-d'Oise, les Yvelines et l'Eure" — pour les phrases meta. */
export const areasSentence = "l'Oise, le Val-d'Oise, les Yvelines et l'Eure";

/** ["Oise", "Val-d'Oise", "Yvelines", "Eure"] — pour les listes / puces. */
export const areaNames = site.areas.map((a) => a.name);
