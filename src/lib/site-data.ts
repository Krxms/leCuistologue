/* ===== Identité du site — SOURCE UNIQUE ============================
   NAP (Name / Address / Phone) + zones + réseaux.
   Consommé par : BaseLayout (schema JSON-LD, OpenGraph), Footer,
   pages légales, page zone d'intervention. Ne jamais redéfinir ces
   valeurs ailleurs — tout doit pointer ici pour rester cohérent
   (cohérence NAP = signal clé du référencement local).
   ================================================================== */

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

  /**
   * Localisation AFFICHÉE PUBLIQUEMENT (footer, schema).
   * Service à domicile = le client ne vient jamais ici : on expose la
   * ville et la zone, PAS l'adresse précise (qui est le domicile privé
   * de Bruno). L'adresse complète reste uniquement sur les pages
   * légales, où elle est obligatoire (entreprise individuelle).
   */
  location: {
    city: "Serans",
    region: "Oise",
    countryCode: "FR",
  },

  /** SIRET / déclaration Services à la personne. */
  siret: "10163002800013",
  siren: "101 630 028",

  /**
   * Zone d'intervention — 4 départements. Bruno couvre l'ensemble du
   * territoire de chacun (exceptions au cas par cas, et interventions
   * possibles au-delà après échange).
   *   slug     : URL /cuisinier-a-domicile-<slug>
   *   prep     : article contracté pour « dans … » (dans l'Oise, dans le Val-d'Oise…)
   *   de       : forme génitive (les villes de l'Oise, du Val-d'Oise, des Yvelines…)
   *   secteur  : micro-région réellement couverte (nom usuel, ex. Vexin-Thelle, Mantois)
   *   communes : liste précise transmise par le client — ne pas compléter
   *              ni remplacer par d'autres villes sans validation de sa part
   *   intro    : phrase d'accroche PROPRE à chaque page département (visible)
   *   metaDesc : meta description PROPRE à chaque page (< ~160 caractères)
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
        "Le Cuistologue est installé à Serans, dans l'Oise, et intervient sur le secteur du Vexin-Thelle : Beauvais, Chaumont-en-Vexin, Méru, Trie-Château, Auneuil, Noailles et les communes voisines.",
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
      metaDesc:
        "Cuisinier à domicile dans l'Eure, secteur du Vexin normand : Vernon, Gisors, Étrépagny, Les Andelys, Écos, Gasny.",
    },
  ],

  /** Fourchette de prix (formules 149 € – 259 €). */
  priceRange: "€€",

  /**
   * Profils officiels — alimente `sameAs` du schema et les liens du footer.
   * Laisser vide tant que les vraies URL ne sont pas connues (ne PAS
   * pointer vers instagram.com / facebook.com génériques).
   */
  social: [] as { label: string; url: string }[],

  /**
   * Image de partage OpenGraph (dans /public). og-image.png fait
   * 1200×1158 (le logo). Un vrai 1200×630 (ratio paysage) serait mieux
   * cadré sur Facebook / X / LinkedIn, qui recadrent au centre.
   */
  ogImage: "/og-image.png",

  /**
   * Codes de vérification des outils pour webmasters. Coller ici la
   * valeur `content` de la balise fournie par chaque service (voir la
   * marche à suivre transmise séparément). Vide = balise non rendue.
   */
  verification: {
    google: "", // Google Search Console — <meta name="google-site-verification" content="…">
    bing: "", // Bing Webmaster Tools — <meta name="msvalidate.01" content="…">
  },
};

/** "Oise, le Val-d'Oise, les Yvelines et l'Eure" — pour les phrases meta. */
export const areasSentence = "l'Oise, le Val-d'Oise, les Yvelines et l'Eure";

/** ["Oise", "Val-d'Oise", "Yvelines", "Eure"] — pour les listes / puces. */
export const areaNames = site.areas.map((a) => a.name);
