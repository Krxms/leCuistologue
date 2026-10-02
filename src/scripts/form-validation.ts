// Validation visuelle partagée par les formulaires (contact, réservation) : surligne en
// rouge le champ fautif quand un champ obligatoire est manquant ou invalide, en plus du
// message natif du navigateur. `selecteurChamp` cible le conteneur (label + input) à
// colorer autour de chaque control `[required]`.
export function activerValidationFormulaire(
  form: HTMLFormElement,
  selecteurChamp: string,
  statusEl?: HTMLElement | null
) {
  const champs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]");

  function conteneurDe(champ: Element): HTMLElement | null {
    return champ.closest(selecteurChamp);
  }

  champs.forEach((champ) => {
    champ.addEventListener("invalid", () => {
      conteneurDe(champ)?.classList.add("champ--erreur");
      if (statusEl) statusEl.textContent = "Merci de compléter les champs obligatoires manquants.";
    });
    const effacerErreur = () => {
      if (champ.validity.valid) conteneurDe(champ)?.classList.remove("champ--erreur");
      if (statusEl && form.checkValidity()) statusEl.textContent = "";
    };
    champ.addEventListener("input", effacerErreur);
    champ.addEventListener("change", effacerErreur);
  });
}
