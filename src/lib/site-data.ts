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
   * intro / contexte / pitch / faq / noteIntro / metaDesc : textes propres à chaque zone.
   * Voix : celle du reste du site. Première phrase à la 3e personne (« Le Cuistologue »), puis « je » / « vous ».
   * Pas de « nous » institutionnel, pas de vocabulaire interne (« validées », « faisabilité »).
   * `contexte` ne contient que des faits géographiques vérifiés (INSEE, BANATIC, PNR du Vexin français) ;
   * à faire valider par le client avant publication définitive.
   * Réponses de FAQ : reprises de /faq (zone, contenants, régimes, présence, courses), jamais inventées.
   * metaDesc : 140 à 160 caractères.
   */
  areas: [
    {
      name: "Oise",
      code: "60",
      slug: "oise",
      prep: "l'Oise",
      de: "de l'Oise",
      secteur: "Ouest de l'Oise",
      communes: ["Beauvais", "Chaumont-en-Vexin", "Méru", "Trie-Château", "Auneuil", "Noailles"],
      intro:
        "Le Cuistologue est installé dans l'Oise, au cœur du Vexin. Il vient cuisiner chez vous à Beauvais, Chaumont-en-Vexin, Méru, Trie-Château, Auneuil et Noailles.",
      contexte:
        "Entre Beauvais, préfecture de l'Oise, et les villages du Vexin, les plateaux agricoles laissent la place à des trajets parfois longs et à des semaines bien remplies. C'est ici que j'ai mes habitudes : une seule venue pour préparer la semaine, plutôt que des soirées passées à courir après l'heure du dîner.",
      pitch:
        "Je viens avec le menu pensé ensemble et, si vous me les confiez, avec les courses faites : produits de saison et, quand le budget et les possibilités locales le permettent, producteurs engagés des environs. Puis je cuisine chez vous, je range les plats dans un réfrigérateur organisé et je laisse la cuisine propre avant de repartir.",
      faq: [
        {
          q: "Intervenez-vous à Beauvais comme dans les villages alentour ?",
          a: "Oui, en ville comme à la campagne : la méthode est la même, c'est moi qui me déplace. La distance peut jouer selon la commune et la prestation. Si la vôtre n'est pas citée, indiquez-la-moi et je vous dirai si je peux intervenir.",
        },
        {
          q: "Combien de repas prépare-t-on en une seule venue ?",
          a: "Cela dépend du temps prévu, du nombre de personnes, des recettes choisies et de la taille des portions. Les formules donnent un nombre de repas indicatif, que nous ajustons ensemble selon votre foyer.",
        },
      ],
      noteIntro: "Votre commune de l'Oise n'apparaît pas dans la liste ?",
      metaDesc:
        "Cuisinier à domicile dans l'Oise, à Beauvais, Chaumont-en-Vexin, Méru : Le Cuistologue prépare vos repas de la semaine chez vous, en une seule session.",
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
        "Dans le Val-d'Oise, Le Cuistologue vient cuisiner chez vous à Cergy, Pontoise, Magny-en-Vexin, Marines, Vigny, Chars, L'Isle-Adam, Persan et Beaumont-sur-Oise.",
      contexte:
        "Dans le Val-d'Oise, deux univers se côtoient : la vallée de l'Oise, avec Cergy et Pontoise, et les villages du Vexin français, parc naturel régional au nord-ouest de Paris. Les rythmes de vie ne sont pas les mêmes, mais l'envie l'est : bien manger toute la semaine sans y laisser ses soirées.",
      pitch:
        "Que vous habitiez un appartement à Cergy ou une maison de village dans le Vexin, la méthode ne change pas. On échange d'abord sur vos habitudes et vos envies, je prépare le menu et la liste de courses, puis je cuisine chez vous en une seule session. Les plats sont rangés dans votre réfrigérateur, la cuisine est rendue propre.",
      faq: [
        {
          q: "J'habite un village du Vexin français : êtes-vous dans mon secteur ?",
          a: "Plusieurs communes du Vexin français font partie de celles où j'interviens, comme Magny-en-Vexin, Marines, Vigny ou Chars. Si la vôtre n'est pas citée, indiquez-la-moi et je vous dirai si je peux intervenir.",
        },
        {
          q: "Ma cuisine est petite, est-ce un obstacle ?",
          a: "Non, je m'adapte à votre cuisine, quelle que soit sa taille, que vous soyez en appartement à Cergy ou en maison de village. Lorsque c'est plus pratique, je peux venir avec une partie de mon petit matériel professionnel.",
        },
      ],
      noteIntro: "Votre commune du Val-d'Oise n'est pas citée ici ?",
      metaDesc:
        "Cuisinier à domicile dans le Val-d'Oise, de Cergy au Vexin français : Le Cuistologue prépare vos repas de la semaine chez vous, en une seule session.",
    },
    {
      name: "Yvelines",
      code: "78",
      slug: "yvelines",
      prep: "les Yvelines",
      de: "des Yvelines",
      secteur: "Ouest des Yvelines",
      communes: ["Mantes-la-Jolie", "Mantes-la-Ville", "Limay", "Houdan", "Septeuil", "Bonnières-sur-Seine"],
      intro:
        "Dans les Yvelines, Le Cuistologue vient cuisiner chez vous à Mantes-la-Jolie, Mantes-la-Ville, Limay, Houdan, Septeuil et Bonnières-sur-Seine.",
      contexte:
        "À l'ouest des Yvelines, la vallée de la Seine rassemble Mantes-la-Jolie, sous-préfecture, Mantes-la-Ville et Limay, qui forment ensemble un bassin de vie urbain. Plus au sud, Houdan et Septeuil sont des communes plus rurales. Des cuisines et des emplois du temps très différents, pour une même envie : manger maison sans y passer sa semaine.",
      pitch:
        "Une seule session chez vous suffit : le menu est choisi avec vous, les courses peuvent m'être confiées, et les repas de la semaine finissent rangés dans un réfrigérateur organisé, dans une cuisine laissée propre. Ce que vous gardez pour vous : vos soirées.",
      faq: [
        {
          q: "J'habite Houdan ou Septeuil, loin de Mantes : intervenez-vous chez moi ?",
          a: "Oui, ces communes font partie de celles où j'interviens. La distance peut jouer selon la commune et la prestation : en cas de doute, indiquez-moi la vôtre et je vous dirai si je peux intervenir chez vous.",
        },
        {
          q: "Je travaille à domicile : puis-je rester pendant que vous cuisinez ?",
          a: "Oui. Vous pouvez rester avec moi, continuer à travailler, vous occuper des enfants ou simplement vaquer à vos occupations. Je m'adapte à votre maison et à votre rythme.",
        },
      ],
      noteIntro: "Une commune des Yvelines proche de Mantes ne figure pas ici ?",
      metaDesc:
        "Cuisinier à domicile dans les Yvelines, à Mantes-la-Jolie, Limay, Houdan : Le Cuistologue prépare vos repas de la semaine chez vous, en une seule session.",
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
        "Dans l'Eure, Le Cuistologue vient cuisiner chez vous à Vernon, Gisors, Étrépagny, Les Andelys, Écos et Gasny.",
      contexte:
        "Dans l'Eure, le Vexin normand s'étend entre l'Epte, l'Andelle et la Seine. Gisors, Vernon, Les Andelys et Étrépagny en sont les principales villes, sur un plateau surtout agricole où les villages sont espacés.",
      pitch:
        "Entre vallée de la Seine et plateau du Vexin, c'est moi qui fais la route. On échange sur vos habitudes, je prépare menus et courses, puis je cuisine chez vous une fois pour toute la semaine. Les plats sont rangés au réfrigérateur, la cuisine est rendue impeccable.",
      faq: [
        {
          q: "Mon village du Vexin normand n'est pas cité : puis-je quand même vous solliciter ?",
          a: "Oui. Les communes citées sont celles où j'interviens habituellement, mais une intervention reste possible après échange. Écrivez-moi avec le nom de votre commune.",
        },
        {
          q: "Je suis végétarien, ou allergique à certains aliments : est-ce adaptable ?",
          a: "Oui, le menu peut être adapté à une alimentation végétarienne ou à d'autres habitudes. En cas d'allergie ou d'intolérance, signalez-le-moi avant l'intervention : nous en parlons précisément avant toute prestation concernée.",
        },
      ],
      noteIntro: "Votre commune de l'Eure n'y figure pas ?",
      metaDesc:
        "Cuisinier à domicile dans l'Eure, à Vernon, Gisors, Les Andelys : Le Cuistologue prépare vos repas de la semaine chez vous, en une seule session.",
    },
  ],

  /** Fourchette de prix (formules 149 € – 259 €). */
  priceRange: "€€",

  /** Profils officiels (`sameAs`, footer). Vide tant que les URL ne sont pas connues. */
  social: [] as { label: string; url: string }[],

  /** Image OpenGraph (dans /public), 1200×699. */
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
