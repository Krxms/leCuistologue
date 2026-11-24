/*
 * Contenu éditable par le propriétaire via WordPress (ACF). Un chargeur par domaine.
 *
 * - Chaque chargeur interroge WordPress une seule fois par build (promesse mémorisée).
 * - Les valeurs du dépôt (ci-dessous et dans formules-data.ts / faq-data.ts) sont les valeurs PAR DÉFAUT :
 *   champ WordPress vide, WordPress indisponible ou schéma absent = le texte actuel du site s'affiche.
 * - Schéma ACF attendu : docs/acf/README.md.
 */

import { getCollection } from "astro:content";
import { requeteCms, texte, paragraphes, enHtml, assainir, enTexteBrut, estLeDefaut } from "./cms";
import {
  formules as formulesDefaut,
  fonctionnalitesCommunes,
  optionsPetitsPlus as optionsDefaut,
  type Formule,
  type OptionPetitPlus,
} from "./formules-data";
import { questions as questionsDefaut, answerToHtml } from "./faq-data";

type Noeuds<T> = { nodes: T[] } | null | undefined;

/* ══════════════════════════ Accueil ══════════════════════════ */

export interface ContenuAccueil {
  hero: { titreDebut: string; titreAccent: string; titreFin: string; description: string; boutonPrincipal: string; boutonSecondaire: string; zone: string };
  presentation: { titre: string; accroche: string; texte: string; italique: string; bouton: string };
  commentCaMarche: { titre: string; titreAccent: string; sousTitre: string; etapes: { titre: string; texte: string }[] };
  temoignages: { titre: string; titreAccent: string; messageVide: string };
  zone: { titre: string; texte: string; note: string; noteLien: string; bouton: string };
  valeurs: { titre: string; titreAccent: string; bulles: { titre: string; texte: string }[] };
  offre: {
    titre: string;
    titreAccent: string;
    accroche: string;
    chapeau: string[];
    listeTitre: string;
    prestations: string[];
    prixLabel: string;
    prixValeur: string;
    prixUnite: string;
    promoAfficher: boolean;
    promoHtml: string;
  };
}

const ACCUEIL_DEFAUT = {
  hero: {
    titreDebut: "Une façon",
    titreAccent: "simple",
    titreFin: "de bien|manger",
    description: "Des repas préparés directement chez vous, par un cuisinier à domicile, pour retrouver le plaisir de bien manger sans passer vos soirées en cuisine.",
    boutonPrincipal: "Découvrir les formules",
    boutonSecondaire: "Demander un devis",
    zone: "Cuisinier à domicile dans l'Oise, le Val-d'Oise, les Yvelines et l'Eure",
  },
  presentation: {
    titre: "Le Cuistologue",
    accroche: "Cuisinier professionnel à domicile spécialiste de la cuisine du quotidien.",
    texte: "Il prépare chez vous une cuisine sur-mesure, ajustée à vos goûts, vos contraintes et votre rythme de vie.",
    italique: "Au-delà de la cuisine, il installe une routine alimentaire durable, pensée pour bien manger, même pendant les journées chargées.",
    bouton: "Découvrir sa démarche",
  },
  commentCaMarche: {
    titre: "Comment",
    titreAccent: "ça marche ?",
    sousTitre: "Une semaine qui se prépare en trois étapes",
    etapes: [
      { titre: "On échange", texte: "Vos habitudes guident chaque intervention." },
      { titre: "Je cuisine chez vous", texte: "Des repas maison préparés directement dans votre cuisine." },
      { titre: "Vous profitez", texte: "Des plats prêts, un frigo organisé et une cuisine impeccable." },
    ],
  },
  temoignages: {
    titre: "C'est encore eux qui en parlent le",
    titreAccent: "mieux",
    messageVide: "Les premiers avis arrivent bientôt — le temps de recueillir les retours des premiers clients.",
  },
  zone: {
    titre: "Une cuisine à domicile, près de chez vous",
    texte: "Le Cuistologue se déplace directement chez vous pour préparer vos repas, sur l'Oise, le Val-d'Oise, les Yvelines et l'Eure.",
    note: "Vous êtes en dehors de cette zone ?",
    noteLien: "Contactez-moi",
    bouton: "Voir la zone d'intervention",
  },
  valeursTitre: "Une cuisine",
  valeursTitreAccent: "qui a du sens",
  bulles: [
    { titre: "L'exigence du métier", texte: "Le savoir-faire d'un professionnel, directement dans votre cuisine." },
    { titre: "Une approche sur-mesure", texte: "Chaque intervention s'adapte à vos habitudes, vos envies et à l'organisation de votre foyer." },
    { titre: "L'agriculture paysanne", texte: "Des produits de saison, choisis autant que possible auprès des producteurs engagés du territoire." },
    { titre: "Le goût du lien", texte: "Le plaisir de cuisiner des repas qui nourrissent aussi les échanges." },
  ],
  offreTitre: "Des solutions culinaires pensées pour vous et",
  offreTitreAccent: "avec vous.",
  offreAccroche: "Le Cuistologue prépare chez vous, en une seule session, vos repas de la semaine.",
  offreChapeau: [
    "Choisissez votre formule selon votre appétit, vos habitudes et la quantité de repas que vous souhaitez déléguer.",
    "Et offrez-vous la possibilité d’ajouter certains services pour aller plus loin dans l’organisation de votre quotidien.",
  ],
  offreListeTitre: "Chaque intervention est composée de :",
  prestations: [
    "Échange préalable sur vos habitudes et vos envies",
    "Menus personnalisés",
    "Courses réalisées pour vous",
    "Cuisine à domicile",
    "Organisation du réfrigérateur",
    "Remise au propre de la cuisine",
    "Conseils de conservation",
    "Organisation d’une routine culinaire",
    "Réserve gourmande",
    "Popotes à emporter",
  ],
  prixLabel: "À partir de",
  prixValeur: "74,50 €",
  prixUnite: "/ intervention",
  promoTexte: "Offre de lancement : **-20%** sur votre 1ère intervention",
};

interface PageAccueilWp {
  page?: {
    accueilValeursEtOffre?: Record<string, unknown> | null;
    accueilHautDePage?: Record<string, unknown> | null;
    accueilBasDePage?: Record<string, unknown> | null;
  } | null;
  prestations?: Noeuds<{ title?: string }>;
}

let accueilEnCours: Promise<ContenuAccueil> | null = null;

export function getAccueil(): Promise<ContenuAccueil> {
  accueilEnCours ??= chargerAccueil();
  return accueilEnCours;
}

async function chargerAccueil(): Promise<ContenuAccueil> {
  const [pageWp, prestationsWp] = await Promise.all([
    requeteCms<PageAccueilWp>(
      "accueil",
      `{ page(id: "/accueil/", idType: URI) { accueilValeursEtOffre {
        valeursTitre valeursTitreAccent
        valeur1Titre valeur1Texte valeur2Titre valeur2Texte valeur3Titre valeur3Texte valeur4Titre valeur4Texte
        offreTitre offreTitreAccent offreAccroche offreChapeau offreListeTitre
        offrePrixLabel offrePrixValeur offrePrixUnite offrePromoAfficher offrePromoTexte
      }
      accueilHautDePage {
        heroTitreDebut heroTitreAccent heroTitreFin heroDescription heroBoutonPrincipal heroBoutonSecondaire heroZone
        presentationTitre presentationAccroche presentationTexte presentationItalique presentationBouton
      }
      accueilBasDePage {
        cmTitre cmTitreAccent cmSousTitre cmEtape1Titre cmEtape1Texte cmEtape2Titre cmEtape2Texte cmEtape3Titre cmEtape3Texte
        temoignagesTitre temoignagesTitreAccent temoignagesMessageVide
        zoneTitre zoneTexte zoneNote zoneNoteLien zoneBouton
      } } }`,
    ),
    requeteCms<PageAccueilWp>(
      "prestations",
      `{ prestations(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } }) { nodes { title } } }`,
    ),
  ]);

  const c = pageWp?.page?.accueilValeursEtOffre ?? {};
  const h = pageWp?.page?.accueilHautDePage ?? {};
  const b = pageWp?.page?.accueilBasDePage ?? {};
  const d = ACCUEIL_DEFAUT;

  const prestationsCms = (prestationsWp?.prestations?.nodes ?? [])
    .map((n) => texte(n.title, ""))
    .filter(Boolean);

  // Interrupteur : absent (champ jamais créé ou page non renseignée) = offre affichée comme aujourd'hui.
  const promoAfficher = typeof c.offrePromoAfficher === "boolean" ? c.offrePromoAfficher : true;

  return {
    hero: {
      titreDebut: texte(h.heroTitreDebut, d.hero.titreDebut),
      titreAccent: texte(h.heroTitreAccent, d.hero.titreAccent),
      titreFin: texte(h.heroTitreFin, d.hero.titreFin),
      description: texte(h.heroDescription, d.hero.description),
      boutonPrincipal: texte(h.heroBoutonPrincipal, d.hero.boutonPrincipal),
      boutonSecondaire: texte(h.heroBoutonSecondaire, d.hero.boutonSecondaire),
      zone: texte(h.heroZone, d.hero.zone),
    },
    presentation: {
      titre: texte(h.presentationTitre, d.presentation.titre),
      accroche: texte(h.presentationAccroche, d.presentation.accroche),
      texte: texte(h.presentationTexte, d.presentation.texte),
      italique: texte(h.presentationItalique, d.presentation.italique),
      bouton: texte(h.presentationBouton, d.presentation.bouton),
    },
    commentCaMarche: {
      titre: texte(b.cmTitre, d.commentCaMarche.titre),
      titreAccent: texte(b.cmTitreAccent, d.commentCaMarche.titreAccent),
      sousTitre: texte(b.cmSousTitre, d.commentCaMarche.sousTitre),
      etapes: d.commentCaMarche.etapes.map((etape, i) => ({
        titre: texte(b[`cmEtape${i + 1}Titre`], etape.titre),
        texte: texte(b[`cmEtape${i + 1}Texte`], etape.texte),
      })),
    },
    temoignages: {
      titre: texte(b.temoignagesTitre, d.temoignages.titre),
      titreAccent: texte(b.temoignagesTitreAccent, d.temoignages.titreAccent),
      messageVide: texte(b.temoignagesMessageVide, d.temoignages.messageVide),
    },
    zone: {
      titre: texte(b.zoneTitre, d.zone.titre),
      texte: texte(b.zoneTexte, d.zone.texte),
      note: texte(b.zoneNote, d.zone.note),
      noteLien: texte(b.zoneNoteLien, d.zone.noteLien),
      bouton: texte(b.zoneBouton, d.zone.bouton),
    },
    valeurs: {
      titre: texte(c.valeursTitre, d.valeursTitre),
      titreAccent: texte(c.valeursTitreAccent, d.valeursTitreAccent),
      bulles: d.bulles.map((bulle, i) => ({
        titre: texte(c[`valeur${i + 1}Titre`], bulle.titre),
        texte: texte(c[`valeur${i + 1}Texte`], bulle.texte),
      })),
    },
    offre: {
      titre: texte(c.offreTitre, d.offreTitre),
      titreAccent: texte(c.offreTitreAccent, d.offreTitreAccent),
      accroche: texte(c.offreAccroche, d.offreAccroche),
      chapeau: paragraphes(c.offreChapeau, d.offreChapeau),
      listeTitre: texte(c.offreListeTitre, d.offreListeTitre),
      prestations: prestationsCms.length ? prestationsCms : d.prestations,
      prixLabel: texte(c.offrePrixLabel, d.prixLabel),
      prixValeur: texte(c.offrePrixValeur, d.prixValeur),
      prixUnite: texte(c.offrePrixUnite, d.prixUnite),
      promoAfficher,
      promoHtml: enHtml(texte(c.offrePromoTexte, d.promoTexte)),
    },
  };
}

/* ══════════════════════════ À propos ══════════════════════════ */

export interface Petale {
  slug: "metier" | "terre" | "creativite" | "social" | "transmission";
  titre: string;
  paras: string[];
  accent: string;
}

export interface ContenuAPropos {
  titre: string;
  sousTitre: string;
  petales: Petale[];
}

const APROPOS_DEFAUT: ContenuAPropos = {
  titre: "Bruno Pereira Vaz",
  sousTitre: "Le goût du lien",
  petales: [
    {
      slug: "metier",
      titre: "Le métier",
      paras: [
        "Le fait maison est pour moi une manière de pratiquer sérieusement le métier de cuisinier.",
        "Cela passe par la connaissance des produits, la maîtrise des gestes, le respect des cuissons et, surtout, le temps que l'on accepte de consacrer au travail bien fait.",
      ],
      accent: "Je défends une cuisine artisanale, simple mais exigeante, où le savoir-faire retrouve toute sa place face à la standardisation.",
    },
    {
      slug: "terre",
      titre: "La terre",
      paras: [
        "Mes choix commencent bien avant la cuisine, auprès de celles et ceux qui produisent notre alimentation.",
        "Je privilégie donc les producteurs locaux et porte une attention particulière à l'agriculture paysanne.",
      ],
      accent: "C'est une manière pour moi de valoriser les territoires mais aussi de défendre un modèle alimentaire qui donne une place centrale à celles et ceux qui nous nourrissent.",
    },
    {
      slug: "creativite",
      titre: "La créativité",
      paras: [
        "Chaque alimentation est singulière, avec ses goûts, ses habitudes, ses convictions, ses allergies ou ses intolérances.",
        "Ma cuisine s'adapte à chacun sans renoncer au plaisir ni à l'exigence.",
      ],
      accent: "Mon rôle n'est pas de vous dire ce que vous devriez manger, mais de mettre mon savoir-faire et ma créativité au service de vos choix.",
    },
    {
      slug: "social",
      titre: "Le lien social",
      paras: [
        "Bien manger ne se limite pas à ce qu'il y a dans l'assiette. Cela tient aussi au temps que l'on prend, aux échanges que l'on partage et aux liens que l'on tisse. Cuisiner chez vous est donc un engagement social autant que culinaire.",
      ],
      accent: "À l'heure où nos relations se dématérialisent, chaque intervention est aussi l'occasion d'une présence, d'une conversation et d'un moment de convivialité.",
    },
    {
      slug: "transmission",
      titre: "La transmission",
      paras: [
        "Cuisiner, c'est aussi apprendre et transmettre. J'aime partager des gestes, des recettes et des connaissances sur les produits et les saisons, pour éveiller la curiosité et enrichir le rapport de chacun à son alimentation.",
      ],
      accent: "À travers mes interventions et mes ateliers, je souhaite ainsi faire vivre et circuler une véritable culture du bien-manger.",
    },
  ],
};

let aProposEnCours: Promise<ContenuAPropos> | null = null;

export function getAPropos(): Promise<ContenuAPropos> {
  aProposEnCours ??= chargerAPropos();
  return aProposEnCours;
}

async function chargerAPropos(): Promise<ContenuAPropos> {
  const petalesChamps = [1, 2, 3, 4, 5]
    .map((n) => `petale${n}Titre petale${n}Contenu petale${n}Accroche`)
    .join(" ");
  const donnees = await requeteCms<{ page?: { pageAPropos?: Record<string, unknown> | null } | null }>(
    "a-propos",
    `{ page(id: "/le-cuistologue/", idType: URI) { pageAPropos { titre sousTitre ${petalesChamps} } } }`,
  );
  const c = donnees?.page?.pageAPropos ?? {};

  return {
    titre: texte(c.titre, APROPOS_DEFAUT.titre),
    sousTitre: texte(c.sousTitre, APROPOS_DEFAUT.sousTitre),
    petales: APROPOS_DEFAUT.petales.map((p, i) => ({
      slug: p.slug,
      titre: texte(c[`petale${i + 1}Titre`], p.titre),
      paras: paragraphes(c[`petale${i + 1}Contenu`], p.paras),
      accent: texte(c[`petale${i + 1}Accroche`], p.accent),
    })),
  };
}

/* ══════════════════════════ Formules et options ══════════════════════════ */

const enEuros = (n: number) =>
  `${n.toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })} €`;

/** Prix « 159 € » / « 79,50 € » → nombre. */
const versNombre = (prix: string) => parseFloat(prix.replace(/[^\d,]/g, "").replace(",", "."));

/** Prix après crédit d'impôt : saisi dans WordPress, sinon la moitié du prix plein (crédit de 50 %). */
function prixReduit(saisi: unknown, plein: string): string {
  const valeur = texte(saisi, "");
  if (valeur) return valeur;
  const n = versNombre(plein);
  return Number.isFinite(n) ? enEuros(n / 2) : plein;
}

/** Texte à une ligne par élément → liste, sinon la liste par défaut. */
function lignes(valeur: unknown, defaut: string[]): string[] {
  if (typeof valeur !== "string" || estLeDefaut(valeur, defaut)) return defaut;
  const liste = valeur.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return liste.length ? liste : defaut;
}

interface FormuleWp {
  slug?: string;
  title?: string;
  champsFormule?: Record<string, unknown> | null;
  contenuFormule?: { inclus?: string } | null;
}

let formulesEnCours: Promise<Formule[]> | null = null;

export function getFormules(): Promise<Formule[]> {
  formulesEnCours ??= chargerFormules();
  return formulesEnCours;
}

async function chargerFormules(): Promise<Formule[]> {
  const donnees = await requeteCms<{ formules?: Noeuds<FormuleWp> }>(
    "formules",
    `{ formules(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) { nodes {
      slug title champsFormule { portions duree ponctuelPrixPlein ponctuelPrixReduit routinePrixPlein routinePrixReduit misEnAvant }
      contenuFormule { inclus }
    } } }`,
  );
  const noeuds = (donnees?.formules?.nodes ?? []).filter((n) => texte(n.slug, "") && texte(n.title, ""));
  if (noeuds.length === 0) return formulesDefaut;

  return noeuds.map((n) => {
    const defaut = formulesDefaut.find((f) => f.slug === n.slug);
    const c = n.champsFormule ?? {};
    const ponctuelPlein = texte(c.ponctuelPrixPlein, defaut?.ponctuelle.prixPlein ?? "");
    const routinePlein = texte(c.routinePrixPlein, defaut?.routine.prixPlein ?? "");
    return {
      slug: n.slug as string,
      titre: n.title as string,
      portions: texte(c.portions, defaut?.portions ?? ""),
      fonctionnalites: lignes(n.contenuFormule?.inclus, defaut?.fonctionnalites ?? fonctionnalitesCommunes),
      duree: texte(c.duree, defaut?.duree ?? ""),
      ponctuelle: {
        prixPlein: ponctuelPlein,
        prixReduit: prixReduit(c.ponctuelPrixReduit, ponctuelPlein),
      },
      routine: {
        prixPlein: routinePlein,
        prixReduit: prixReduit(c.routinePrixReduit, routinePlein),
      },
      misEnAvant: typeof c.misEnAvant === "boolean" ? c.misEnAvant : (defaut?.misEnAvant ?? false),
    };
  });
}

interface OptionWp {
  slug?: string;
  title?: string;
  champsOption?: Record<string, unknown> | null;
}

const CARTES: OptionPetitPlus["carte"][] = ["course", "popote", "gourmande"];

let optionsEnCours: Promise<OptionPetitPlus[]> | null = null;

export function getOptions(): Promise<OptionPetitPlus[]> {
  optionsEnCours ??= chargerOptions();
  return optionsEnCours;
}

async function chargerOptions(): Promise<OptionPetitPlus[]> {
  const donnees = await requeteCms<{ options?: Noeuds<OptionWp> }>(
    "options",
    `{ options(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) { nodes {
      slug title champsOption { labelFormulaire prix prixReduit corps precision carte }
    } } }`,
  );
  const noeuds = (donnees?.options?.nodes ?? []).filter((n) => texte(n.slug, "") && texte(n.title, ""));
  if (noeuds.length === 0) return optionsDefaut;

  return noeuds.map((n, i) => {
    const defaut = optionsDefaut.find((o) => o.slug === n.slug);
    const c = n.champsOption ?? {};
    const prix = texte(c.prix, defaut?.prix ?? "");
    const carteSaisie = Array.isArray(c.carte) ? c.carte[0] : c.carte;
    const carte = CARTES.includes(carteSaisie as OptionPetitPlus["carte"])
      ? (carteSaisie as OptionPetitPlus["carte"])
      : (defaut?.carte ?? CARTES[i % CARTES.length]);
    const corpsCms = paragraphes(c.corps, []);
    const precision = texte(c.precision, defaut?.precision ?? "");
    return {
      slug: n.slug as string,
      carte,
      titre: n.title as string,
      labelFormulaire: texte(c.labelFormulaire, defaut?.labelFormulaire ?? (n.title as string)),
      prix,
      prixReduit: prixReduit(c.prixReduit, prix),
      corps: corpsCms.length ? corpsCms.map(enHtml).join("<br><br>") : (defaut?.corps ?? ""),
      ...(precision ? { precision } : {}),
    };
  });
}

/* ══════════════════════════ FAQ ══════════════════════════ */

export interface QuestionFaq {
  q: string;
  /** Réponse en HTML déjà assaini. */
  html: string;
  /** Réponse en texte brut (JSON-LD). */
  texte: string;
}

let faqEnCours: Promise<QuestionFaq[]> | null = null;

export function getFaq(): Promise<QuestionFaq[]> {
  faqEnCours ??= chargerFaq();
  return faqEnCours;
}

function faqParDefaut(): QuestionFaq[] {
  return questionsDefaut.map(({ q, r }) => {
    const html = r
      .split("\n\n")
      .map((p) => `<p>${answerToHtml(p)}</p>`)
      .join("");
    return { q, html, texte: enTexteBrut(html) };
  });
}

async function chargerFaq(): Promise<QuestionFaq[]> {
  // Brouillon, privé ou corbeille = masqué : seules les questions publiées sont renvoyées.
  const donnees = await requeteCms<{ questions?: Noeuds<{ title?: string; champsQuestion?: { reponse?: string } | null }> }>(
    "faq",
    `{ questions(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) { nodes { title champsQuestion { reponse } } } }`,
  );
  const items = (donnees?.questions?.nodes ?? [])
    .map((n) => {
      const html = assainir(n.champsQuestion?.reponse ?? "");
      return { q: texte(enTexteBrut(n.title ?? ""), ""), html, texte: enTexteBrut(html) };
    })
    .filter((item) => item.q && item.html);
  return items.length ? items : faqParDefaut();
}

/** Schema.org FAQPage construit sur la liste affichée. */
export function faqJsonLd(items: QuestionFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, texte }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: texte },
    })),
  };
}

/* ══════════════════════════ Journal ══════════════════════════ */

export interface ArticleJournal {
  /** Fin d'URL : /journal/<id>/ */
  id: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  date: Date;
  updated?: Date;
  /** Corps en HTML assaini. */
  html: string;
}

interface ArticleWp {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  modified?: string;
  champsArticle?: { seoTitre?: string; seoDescription?: string } | null;
}

const ARTICLES_EXCLUS = new Set(["hello-world", "bonjour-tout-le-monde"]);

let journalEnCours: Promise<ArticleJournal[]> | null = null;

export function getJournal(): Promise<ArticleJournal[]> {
  journalEnCours ??= chargerJournal();
  return journalEnCours;
}

async function chargerJournal(): Promise<ArticleJournal[]> {
  const [donnees, locaux] = await Promise.all([
    requeteCms<{ posts?: Noeuds<ArticleWp> }>(
      "journal",
      `{ posts(first: 100, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) { nodes {
        slug title excerpt content date modified champsArticle { seoTitre seoDescription }
      } } }`,
    ),
    getCollection("journal", ({ data }) => !data.draft),
  ]);

  const articles = new Map<string, ArticleJournal>();

  // Articles Markdown du dépôt : conservés tant qu'ils n'ont pas été recréés dans WordPress (même adresse = WordPress l'emporte).
  for (const post of locaux) {
    articles.set(post.id, {
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      seoTitle: post.data.seoTitle,
      seoDescription: post.data.seoDescription,
      date: post.data.date,
      updated: post.data.updated,
      html: post.rendered?.html ?? "",
    });
  }

  for (const n of donnees?.posts?.nodes ?? []) {
    const id = texte(n.slug, "");
    // Article d'exemple créé par défaut par WordPress : jamais publié sur le site.
    if (ARTICLES_EXCLUS.has(id)) continue;
    const title = texte(enTexteBrut(n.title ?? ""), "");
    const html = assainir(n.content ?? "");
    if (!id || !title || !html) continue;
    const extrait = enTexteBrut(n.excerpt ?? "");
    const seoDescription = texte(n.champsArticle?.seoDescription, "");
    const modifie = n.modified ? new Date(n.modified) : undefined;
    const date = new Date(n.date ?? Date.now());
    articles.set(id, {
      id,
      title,
      description: seoDescription || extrait,
      seoTitle: texte(n.champsArticle?.seoTitre, "") || undefined,
      seoDescription: seoDescription || undefined,
      date,
      updated: modifie && modifie.getTime() - date.getTime() > 24 * 3600 * 1000 ? modifie : undefined,
      html,
    });
  }

  return [...articles.values()].sort((a, b) => b.date.getTime() - a.date.getTime());
}
