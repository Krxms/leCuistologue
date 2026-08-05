export interface Avis {
  note: number;
  texte: string;
  nom: string;
  role: string;
}

// Données de secours — utilisées si la clé API ou le Place ID ne sont pas
// encore configurés, pour ne jamais casser le build en attendant.
const avisSecours: Avis[] = [
  {
    note: 5,
    texte: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    nom: "Sophie L.",
    role: "Mère de famille, Sagy",
  },
  {
    note: 5,
    texte: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    nom: "Thomas D.",
    role: "Chef d'entreprise, Vigny",
  },
  {
    note: 5,
    texte: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    nom: "Thomas D.",
    role: "Chef d'entreprise, Vigny",
  },
  {
    note: 5,
    texte: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    nom: "Thomas D.",
    role: "Chef d'entreprise, Vigny",
  },
];

export async function fetchGoogleReviews(): Promise<Avis[]> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      "[googleReviews] GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID absent — affichage des avis de secours."
    );
    return avisSecours;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&language=fr&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result?.reviews?.length) {
      console.warn("[googleReviews] Aucun avis retourné par l'API — affichage des avis de secours.");
      return avisSecours;
    }

    return data.result.reviews.map((r: any) => ({
      note: r.rating,
      texte: r.text,
      nom: r.author_name,
      role: "", // Google ne fournit pas de rôle/profession — à laisser vide ou à retirer à l'affichage
    }));
  } catch (error) {
    console.error("[googleReviews] Erreur lors de la récupération des avis :", error);
    return avisSecours;
  }
}