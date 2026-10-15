/// <reference types="@cloudflare/workers-types" />

import { site } from "../src/lib/site-data";

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ASSETS: Fetcher;
}

const EMAIL_CUISTOLOGUE = "contact@lecuistologue.fr";
const EMAIL_EXPEDITEUR = "Le Cuistologue <contact@lecuistologue.fr>";
const ORIGINES_AUTORISEES = ["https://lecuistologue.fr", "https://www.lecuistologue.fr"];

const reponseJson = (corps: object, status: number) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

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
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Valeur du corps JSON : chaîne bornée, ou "" si ce n'est pas une chaîne (tableau, objet…). Le multiligne n'est gardé que pour `multiligne`. */
function texteBorne(valeur: unknown, max: number, multiligne = false): string {
  if (typeof valeur !== "string") return "";
  const nettoye = multiligne ? valeur : valeur.replace(/[\r\n\t]+/g, " ");
  return nettoye.trim().slice(0, max);
}

/** Vérifie le jeton Turnstile auprès de Cloudflare. Sans clé secrète configurée, tout est refusé (jamais d'envoi non protégé). */
async function turnstileValide(env: Env, jeton: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("[api/send] TURNSTILE_SECRET_KEY absent : envoi refusé.");
    return false;
  }
  if (!jeton) return false;
  const corps = new FormData();
  corps.append("secret", env.TURNSTILE_SECRET_KEY);
  corps.append("response", jeton);
  if (ip) corps.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: corps });
  const resultat = (await res.json()) as { success?: boolean };
  return resultat.success === true;
}

const FORMAT_EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

/** Les navigateurs envoient toujours Origin sur un POST fetch : seul le site lui-même (ou son domaine officiel) est accepté. */
function origineAutorisee(request: Request): boolean {
  const origine = request.headers.get("Origin");
  if (!origine) return false;
  return origine === new URL(request.url).origin || ORIGINES_AUTORISEES.includes(origine);
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
                &nbsp;·&nbsp; ${site.phone.display}
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
  if (!origineAutorisee(request)) {
    return reponseJson({ ok: false, erreur: "Origine non autorisée." }, 403);
  }

  let data: any;
  try {
    data = await request.json();
  } catch {
    return reponseJson({ ok: false, erreur: "Corps de requête invalide." }, 400);
  }
  if (!data || typeof data !== "object") {
    return reponseJson({ ok: false, erreur: "Corps de requête invalide." }, 400);
  }

  const jeton = texteBorne(data.turnstileToken, 2048);
  if (!(await turnstileValide(env, jeton, request.headers.get("CF-Connecting-IP")))) {
    return reponseJson({ ok: false, erreur: "Vérification anti-spam échouée." }, 403);
  }

  // Tout ce qui vient du corps est borné et forcé en chaîne : `email` est le destinataire de la confirmation, il ne doit jamais être un tableau ni une valeur libre.
  const type = texteBorne(data.type, 20);
  const nom = texteBorne(data.nom, 100);
  const email = texteBorne(data.email, 254);
  const telephone = texteBorne(data.telephone, 30);
  const message = texteBorne(data.message, 5000, true);
  const formuleTitre = texteBorne(data.formuleTitre, 100);
  const formule = texteBorne(data.formule, 100);

  if (!nom || !email || !type) {
    return reponseJson({ ok: false, erreur: "Champs obligatoires manquants." }, 400);
  }
  if (!FORMAT_EMAIL.test(email)) {
    return reponseJson({ ok: false, erreur: "Adresse e-mail invalide." }, 400);
  }

  const estReservation = type === "reservation";
  const objet = estReservation
    ? `Demande de prestation — ${formuleTitre || formule}`
    : "Demande libre — formulaire de contact";

  let detailsHtml = `
    <p><strong>Nom :</strong> ${echapper(nom)}</p>
    <p><strong>E-mail :</strong> ${echapper(email)}</p>
    <p><strong>Téléphone :</strong> ${echapper(telephone)}</p>
  `;

  if (estReservation) {
    const libellesOptions: Record<string, string> = {
      courses: "Courses réalisées pour vous",
      popotes: "Popotes à emporter",
      "reserve-gourmande": "Réserve gourmande",
    };
    const optionsChoisies = (Array.isArray(data.options) ? data.options : [])
      .slice(0, 10)
      .map((o: unknown) => texteBorne(o, 50))
      .filter(Boolean);
    const optionsTexte = optionsChoisies.length
      ? optionsChoisies.map((o: string) => libellesOptions[o] || o).join(", ")
      : "Aucune";

    detailsHtml += `
      <hr />
      <p><strong>Formule :</strong> ${echapper(formuleTitre || formule)}</p>
      <p><strong>Nombre de personnes :</strong> ${echapper(texteBorne(String(data.personnes ?? ""), 10))}</p>
      <p><strong>Date souhaitée :</strong> ${echapper(texteBorne(data.dateSouhaitee, 20))}</p>
      <p><strong>Commune / zone :</strong> ${echapper(texteBorne(data.commune, 100))}</p>
      <p><strong>Options souhaitées :</strong> ${echapper(optionsTexte)}</p>
      <p><strong>Allergies :</strong> ${data.allergies === "oui" ? "Oui — " + echapper(texteBorne(data.allergiesDetails, 500, true)) : "Non"}</p>
    `;
  } else {
    detailsHtml += `<p><strong>Sujet :</strong> ${echapper(texteBorne(data.sujet, 150))}</p>`;
  }

  detailsHtml += `<hr /><p><strong>Message :</strong><br>${echapper(message).replace(/\n/g, "<br>")}</p>`;

  await envoyerEmail(env, {
    to: EMAIL_CUISTOLOGUE,
    subject: objet,
    html: habillerEmail(objet, detailsHtml),
  });

  const confirmationHtml = `
    <p>Bonjour ${echapper(nom)},</p>
    <p>Votre demande a bien été reçue${estReservation ? ` pour la formule <strong>${echapper(formuleTitre)}</strong>` : ""}.</p>
    <p>Le Cuistologue vous recontacte personnellement sous 24h (jours ouvrés) pour affiner votre besoin.</p>
    <p>À très vite,<br>Le Cuistologue</p>
  `;

  await envoyerEmail(env, {
    to: email,
    subject: "Votre demande a bien été reçue — Le Cuistologue",
    html: habillerEmail("Votre demande a bien été reçue", confirmationHtml),
  });

  return reponseJson({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/send" && request.method === "POST") {
      try {
        return await handleSend(request, env);
      } catch (err) {
        // Le détail (réponse brute de Resend) reste dans les logs Cloudflare, jamais renvoyé au navigateur.
        console.error("[api/send]", err);
        return reponseJson({ ok: false, erreur: "Envoi impossible pour le moment." }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};