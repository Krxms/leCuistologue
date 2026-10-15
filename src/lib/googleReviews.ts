export interface Avis {
  note: number;
  texte: string;
  nom: string;
  role: string;
}

/** Gabarit, jamais affiché : ne pas y mettre de faux avis. */
const avisModele: Avis[] = [
  // { note: 5, texte: "…", nom: "Prénom N.", role: "… , Ville" },
];

interface AvisPlacesApi {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string };
}

/** Avis Google via Places API (New), lus au build (site statique) : un appel par déploiement. */
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
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("[googleReviews] Erreur Places API :", data?.error?.message ?? response.status);
      return avisModele;
    }

    const avis: Avis[] = ((data.reviews ?? []) as AvisPlacesApi[])
      .map((r) => ({
        note: Math.min(5, Math.max(0, Math.round(r.rating ?? 0))),
        texte: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        nom: r.authorAttribution?.displayName ?? "",
        role: "", // Google ne fournit pas de rôle/profession
      }))
      .filter((a) => a.texte && a.nom && a.note > 0);

    if (!avis.length) {
      console.warn("[googleReviews] Aucun avis retourné par l'API — section témoignages masquée.");
    }
    return avis.length ? avis : avisModele;
  } catch (error) {
    console.error("[googleReviews] Erreur lors de la récupération des avis :", error);
    return avisModele;
  }
}
