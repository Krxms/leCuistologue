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

  /** Adresse légale (mentions légales / CGV). Sert de PostalAddress au schema. */
  address: {
    street: "5 rue de la Mairie",
    postalCode: "60240",
    city: "Serans",
    region: "Oise",
    countryCode: "FR",
  },

  /** SIRET / déclaration Services à la personne. */
  siret: "10163002800013",
  siren: "101 630 028",

  /** Zone d'intervention — 4 départements autour du Vexin. Ordre = ordre d'affichage. */
  areas: [
    { name: "Oise", code: "60" },
    { name: "Val-d'Oise", code: "95" },
    { name: "Yvelines", code: "78" },
    { name: "Eure", code: "27" },
  ],

  /** Fourchette de prix (formules 149 € – 259 €). */
  priceRange: "€€",

  /**
   * Profils officiels — alimente `sameAs` du schema et les liens du footer.
   * Laisser vide tant que les vraies URL ne sont pas connues (ne PAS
   * pointer vers instagram.com / facebook.com génériques).
   */
  social: [] as { label: string; url: string }[],
};

/** "Oise, le Val-d'Oise, les Yvelines et l'Eure" — pour les phrases meta. */
export const areasSentence = "l'Oise, le Val-d'Oise, les Yvelines et l'Eure";

/** ["Oise", "Val-d'Oise", "Yvelines", "Eure"] — pour les listes / puces. */
export const areaNames = site.areas.map((a) => a.name);
