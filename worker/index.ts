/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
  ASSETS: Fetcher;
}

const EMAIL_CUISTOLOGUE = "contact@lecuistologue.fr";
const EMAIL_EXPEDITEUR = "Le Cuistologue <contact@lecuistologue.fr>";

async function envoyerEmail(env: Env, payload: {
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_EXPEDITEUR,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend a refusé l'envoi : ${res.status} — ${detail}`);
  }
}

function echapper(texte: string) {
  return texte.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function handleSend(request: Request, env: Env): Promise<Response> {
  let data: any;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, erreur: "Corps de requête invalide." }), { status: 400 });
  }

  const { type, nom, email, telephone, preference, message } = data;

  if (!nom || !email || !type) {
    return new Response(JSON.stringify({ ok: false, erreur: "Champs obligatoires manquants." }), { status: 400 });
  }

  const estReservation = type === "reservation";
  const objet = estReservation
    ? `Demande de prestation — ${echapper(data.formuleTitre || data.formule || "")}`
    : "Demande libre — formulaire de contact";

  let detailsHtml = `
    <p><strong>Nom :</strong> ${echapper(nom)}</p>
    <p><strong>E-mail :</strong> ${echapper(email)}</p>
    <p><strong>Préférence de contact :</strong> ${preference === "telephone" ? "Téléphone" : "E-mail"}</p>
    ${telephone ? `<p><strong>Téléphone :</strong> ${echapper(telephone)}</p>` : ""}
  `;

  if (estReservation) {
    detailsHtml += `
      <hr />
      <p><strong>Formule :</strong> ${echapper(data.formuleTitre || data.formule || "")}</p>
      <p><strong>Nombre de personnes :</strong> ${echapper(String(data.personnes || ""))}</p>
      <p><strong>Date souhaitée :</strong> ${echapper(data.dateSouhaitee || "")}</p>
      <p><strong>Commune / zone :</strong> ${echapper(data.commune || "")}</p>
      <p><strong>Allergies :</strong> ${data.allergies === "oui" ? "Oui — " + echapper(data.allergiesDetails || "") : "Non"}</p>
    `;
  } else {
    detailsHtml += `<p><strong>Sujet :</strong> ${echapper(data.sujet || "")}</p>`;
  }

  detailsHtml += `<hr /><p><strong>Message :</strong><br>${echapper(message || "").replace(/\n/g, "<br>")}</p>`;

  await envoyerEmail(env, {
    to: EMAIL_CUISTOLOGUE,
    subject: objet,
    html: detailsHtml,
  });

  const confirmationHtml = `
    <p>Bonjour ${echapper(nom)},</p>
    <p>Votre demande a bien été reçue${estReservation ? ` pour la formule <strong>${echapper(data.formuleTitre || "")}</strong>` : ""}.</p>
    <p>Le Cuistologue vous recontacte personnellement sous 24h pour affiner votre besoin.</p>
    <p>À très vite,<br>Le Cuistologue</p>
  `;

  await envoyerEmail(env, {
    to: email,
    subject: "Votre demande a bien été reçue — Le Cuistologue",
    html: confirmationHtml,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/send" && request.method === "POST") {
      try {
        return await handleSend(request, env);
      } catch (err) {
        return new Response(
          JSON.stringify({ ok: false, erreur: err instanceof Error ? err.message : "Erreur inconnue." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};