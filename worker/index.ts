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

function habillerEmail(titre: string, contenuHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<body style="margin:0; padding:0; background-color:#f4f1ec; font-family:Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">

          <!-- En-tête -->
          <tr>
            <td align="center" style="background-color:#253d4a; padding:28px 24px;">
              <img src="https://lecuistologue.fr/images/logo-email.png" alt="Le Cuistologue" width="140" style="display:block; margin-bottom:12px;" />
              <p style="margin:0; color:#fdfbfa; font-size:18px; font-weight:600;">${echapper(titre)}</p>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding:28px 24px; color:#2c2c2c; font-size:15px; line-height:1.6;">
              ${contenuHtml}
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td align="center" style="background-color:#f8f4ef; padding:20px 24px; font-size:12px; color:#6b6b6b;">
              <p style="margin:0 0 4px;">Le Cuistologue — Cuisine à domicile</p>
              <p style="margin:0;">
                <a href="mailto:contact@lecuistologue.fr" style="color:#bc843c; text-decoration:none;">contact@lecuistologue.fr</a>
                &nbsp;·&nbsp; 06 19 95 74 09
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
    html: habillerEmail(objet, detailsHtml),
  });

  const confirmationHtml = `
    <p>Bonjour ${echapper(nom)},</p>
    <p>Votre demande a bien été reçue${estReservation ? ` pour la formule <strong>${echapper(data.formuleTitre || "")}</strong>` : ""}.</p>
    <p>Le Cuistologue vous recontacte personnellement sous 24h (jours ouvrés) pour affiner votre besoin.</p>
    <p>À très vite,<br>Le Cuistologue</p>
  `;

  await envoyerEmail(env, {
    to: email,
    subject: "Votre demande a bien été reçue — Le Cuistologue",
    html: habillerEmail("Votre demande a bien été reçue", confirmationHtml),
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