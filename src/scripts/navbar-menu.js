document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("navbar-burger");
  const menu = document.getElementById("navbar-mobile-menu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Ferme le menu automatiquement si on clique sur un lien à l'intérieur
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // Ferme le menu si on clique/tape en dehors du menu ou du burger
  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("is-open") &&
      !menu.contains(event.target) &&
      !burger.contains(event.target)
    ) {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Referme le menu si la fenêtre est agrandie au-delà du seuil burger
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
});