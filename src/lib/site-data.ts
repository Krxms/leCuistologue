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
   *   communes : villes repères (préfectures, sous-préfectures, communes connues)
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
      communes: ["Beauvais", "Compiègne", "Creil", "Chantilly", "Senlis", "Méru", "Chaumont-en-Vexin"],
      intro:
        "L'Oise, c'est le département d'attache du Cuistologue : il est installé à Serans, dans le Vexin, et intervient sur l'ensemble du territoire — de Beauvais à Compiègne, en passant par Chantilly, Senlis, Creil ou Méru.",
      metaDesc:
        "Cuisinier à domicile dans l'Oise : Le Cuistologue prépare vos repas de la semaine chez vous, de Beauvais à Compiègne, Chantilly, Senlis ou Creil.",
    },
    {
      name: "Val-d'Oise",
      code: "95",
      slug: "val-doise",
      prep: "le Val-d'Oise",
      de: "du Val-d'Oise",
      communes: ["Cergy", "Pontoise", "Argenteuil", "L'Isle-Adam", "Franconville", "Ermont", "Magny-en-Vexin"],
      intro:
        "Le Cuistologue se déplace dans tout le Val-d'Oise, de l'agglomération de Cergy-Pontoise au Vexin français, en passant par L'Isle-Adam, Franconville ou Ermont.",
      metaDesc:
        "Cuisinier à domicile dans le Val-d'Oise : repas maison préparés chez vous, de Cergy-Pontoise au Vexin français, L'Isle-Adam, Franconville ou Ermont.",
    },
    {
      name: "Yvelines",
      code: "78",
      slug: "yvelines",
      prep: "les Yvelines",
      de: "des Yvelines",
      communes: ["Versailles", "Saint-Germain-en-Laye", "Poissy", "Sartrouville", "Les Mureaux", "Mantes-la-Jolie", "Rambouillet"],
      intro:
        "Dans les Yvelines, Le Cuistologue intervient de Mantes-la-Jolie à Saint-Germain-en-Laye, en passant par Poissy, Les Mureaux, Sartrouville ou Versailles.",
      metaDesc:
        "Cuisinier à domicile dans les Yvelines : repas de la semaine préparés chez vous, de Mantes-la-Jolie à Saint-Germain-en-Laye, Poissy ou Versailles.",
    },
    {
      name: "Eure",
      code: "27",
      slug: "eure",
      prep: "l'Eure",
      de: "de l'Eure",
      communes: ["Évreux", "Vernon", "Les Andelys", "Gisors", "Louviers", "Gaillon", "Pont-de-l'Arche"],
      intro:
        "Le Cuistologue traverse la limite normande pour intervenir dans l'Eure, du Vexin normand autour de Gisors jusqu'à Vernon, Les Andelys, Louviers ou Évreux.",
      metaDesc:
        "Cuisinier à domicile dans l'Eure : repas maison préparés chez vous, du Vexin normand autour de Gisors jusqu'à Vernon, Les Andelys ou Évreux.",
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
