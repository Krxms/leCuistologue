export interface Avis {
  note: number;
  texte: string;
  nom: string;
  role: string;
}

export interface ResumeAvis {
  /** Note moyenne Google (0 si inconnue). */
  note: number;
  /** Nombre total d'avis Google sur la fiche (0 si inconnu). */
  total: number;
  /** Avis affichés (Places API : 5 maximum, triés par pertinence). */
  avis: Avis[];
}

/** Gabarit, jamais affiché : ne pas y mettre de faux avis. */
const resumeModele: ResumeAvis = { note: 0, total: 0, avis: [] };

interface AvisPlacesApi {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string };
}

/** Avis Google via Places API (New), lus au build (site statique) : un appel par déploiement. */
export async function fetchGoogleReviews(): Promise<ResumeAvis> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      "[googleReviews] GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID absent — section témoignages masquée."
    );
    return resumeModele;
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("[googleReviews] Erreur Places API :", data?.error?.message ?? response.status);
      return resumeModele;
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
      console.warn("[googleReviews] Aucun avis retourné par l'API — liste d'avis vide.");
    }

    return {
      note: typeof data.rating === "number" ? data.rating : 0,
      total: typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
      avis,
    };
  } catch (error) {
    console.error("[googleReviews] Erreur lors de la récupération des avis :", error);
    return resumeModele;
  }
}
