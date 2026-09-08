export interface Avis {
  note: number;
  texte: string;
  nom: string;
  role: string;
}

/**
 * Gabarit d'avis — NON utilisé pour l'affichage. Tant qu'il n'y a pas de
 * vrais avis (API Google configurée, ou tableau ci-dessous rempli avec de
 * vrais témoignages), fetchGoogleReviews() renvoie [] et la section
 * « témoignages » ne s'affiche pas du tout (voir temoignages.astro).
 * Ne JAMAIS remettre de faux texte ici : ça repart en production.
 */
const avisModele: Avis[] = [
  // { note: 5, texte: "…", nom: "Prénom N.", role: "… , Ville" },
];

export async function fetchGoogleReviews(): Promise<Avis[]> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      "[googleReviews] GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID absent — section témoignages masquée."
    );
    return avisModele;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&language=fr&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result?.reviews?.length) {
      console.warn("[googleReviews] Aucun avis retourné par l'API — section témoignages masquée.");
      return avisModele;
    }

    return data.result.reviews.map((r: any) => ({
      note: r.rating,
      texte: r.text,
      nom: r.author_name,
      role: "", // Google ne fournit pas de rôle/profession — à laisser vide ou à retirer à l'affichage
    }));
  } catch (error) {
    console.error("[googleReviews] Erreur lors de la récupération des avis :", error);
    return avisModele;
  }
}