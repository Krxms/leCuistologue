/*
 * Accès à WordPress (WPGraphQL + ACF) au moment du build.
 *
 * Règle d'or : le site ne dépend jamais de WordPress pour se construire.
 * Toute erreur (réseau, schéma, délai) renvoie `null` et l'appelant retombe sur les
 * textes par défaut du dépôt (voir contenu.ts). Les champs vides ont le même effet.
 */

const ENDPOINT =
  (import.meta.env.WORDPRESS_GRAPHQL_ENDPOINT as string | undefined) ||
  "https://cms.lecuistologue.fr/graphql";

const DELAI_MS = 15_000;

export async function requeteCms<T>(nom: string, requete: string): Promise<T | null> {
  for (let essai = 0; essai < 2; essai++) {
    try {
      const reponse = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: requete }),
        signal: AbortSignal.timeout(DELAI_MS),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      const json = (await reponse.json()) as { data?: T; errors?: { message: string }[] };
      if (json.errors?.length) throw new Error(json.errors[0].message);
      return json.data ?? null;
    } catch (erreur) {
      if (essai === 1) {
        console.warn(`[cms] « ${nom} » indisponible, textes par défaut utilisés : ${(erreur as Error).message}`);
      }
    }
  }
  return null;
}

/** Texte non vide, sinon la valeur par défaut. */
export function texte(valeur: unknown, defaut: string): string {
  return typeof valeur === "string" && valeur.trim() !== "" ? valeur.trim() : defaut;
}

/** Texte sans aucun saut de ligne ni espace multiple : sert à comparer une valeur à son défaut. */
export const aplati = (valeur: string) => valeur.replace(/\s+/g, " ").trim();

/**
 * WordPress renvoie la valeur PAR DÉFAUT d'un champ non enregistré avec les sauts de ligne remplacés par des espaces.
 * Une valeur égale au défaut, aux sauts de ligne près, est donc traitée comme « non modifiée » : on garde le défaut du dépôt.
 */
export function estLeDefaut(valeur: string, defaut: string[]): boolean {
  return aplati(valeur) === aplati(defaut.join(" "));
}

/** Texte brut en paragraphes (séparés par une ligne vide), sinon les paragraphes par défaut. */
export function paragraphes(valeur: unknown, defaut: string[]): string[] {
  if (typeof valeur !== "string" || valeur.trim() === "" || estLeDefaut(valeur, defaut)) return defaut;
  const liste = valeur
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return liste.length ? liste : defaut;
}

const ECHAPPEMENTS: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

export function echapper(valeur: string): string {
  return valeur.replace(/[&<>"]/g, (c) => ECHAPPEMENTS[c]);
}

/** Texte brut → HTML sûr, avec `**gras**` et retours à la ligne (`\n` → <br>). */
export function enHtml(valeur: string): string {
  return echapper(valeur)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/* ── Assainissement du HTML venant de l'éditeur WordPress ── */

const BALISES = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "h2", "h3", "h4",
  "blockquote", "hr", "figure", "figcaption", "img", "table", "thead", "tbody", "tr", "th", "td",
]);
const AUTO_FERMANTES = new Set(["br", "hr", "img"]);

function lienSur(href: string, autoriserRelatif: boolean): string | null {
  const valeur = href.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(valeur)) return valeur;
  if (autoriserRelatif && /^(\/|#)/.test(valeur) && !valeur.startsWith("//")) return valeur;
  return null;
}

function attribut(attributs: string, nom: string): string | null {
  const m = attributs.match(new RegExp(`(?:^|\\s)${nom}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[1] ?? m[2] ?? "") : null;
}

/** Ne garde qu'une liste blanche de balises et d'attributs ; tout le reste est retiré (scripts, styles, classes, commentaires). */
export function assainir(html: string): string {
  const sansBruit = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1\s*>/gi, "");

  return sansBruit
    .replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (balise, nom: string, attributs: string) => {
      const tag = nom.toLowerCase();
      if (!BALISES.has(tag)) return "";
      if (balise.startsWith("</")) return AUTO_FERMANTES.has(tag) ? "" : `</${tag}>`;

      if (tag === "a") {
        const href = lienSur(attribut(attributs, "href") ?? "", true);
        if (!href) return "<a>";
        const externe = /^https?:\/\//i.test(href);
        return `<a href="${echapper(href)}"${externe ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
      }
      if (tag === "img") {
        const src = lienSur(attribut(attributs, "src") ?? "", false);
        if (!src || !/^https:/i.test(src)) return "";
        const alt = attribut(attributs, "alt") ?? "";
        return `<img src="${echapper(src)}" alt="${echapper(alt)}" loading="lazy" decoding="async">`;
      }
      return `<${tag}>`;
    })
    .trim();
}

/** HTML → texte brut sur une ligne (JSON-LD, extraits). */
export function enTexteBrut(html: string): string {
  return html
    .replace(/<\/(p|li|h[1-6]|blockquote)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&#0?39;/g, "'")
    .replace(/&#(d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}
