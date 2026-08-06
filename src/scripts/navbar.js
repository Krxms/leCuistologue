document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("site-navbar");
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  const SEUIL = 8; // ignore les micro-variations (tactile/trackpad)

  function shrink() {
    navbar.classList.add("navbar--scrolling");
  }

  function expand() {
    navbar.classList.remove("navbar--scrolling");
  }

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 10) {
        expand();
      } else if (delta > SEUIL) {
        shrink();
        lastScrollY = currentScrollY;
      } else if (delta < -SEUIL) {
        expand();
        lastScrollY = currentScrollY;
      }
      // Si le déplacement est inférieur au seuil, ou si le scroll s'arrête :
      // on ne fait rien, la navbar garde son état actuel.
    },
    { passive: true }
  );
    const lienAccueil = document.querySelector('.navbar__link[data-href="/"]');
  if (lienAccueil && window.location.pathname === "/") {
    lienAccueil.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});