document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("site-navbar");
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      // Tout en haut de la page : toujours en taille normale
      navbar.classList.remove("navbar--scrolling");
    } else if (currentScrollY > lastScrollY) {
      // Défilement vers le bas : rétrécie
      navbar.classList.add("navbar--scrolling");
    } else {
      // Défilement vers le haut : reprend sa taille normale
      navbar.classList.remove("navbar--scrolling");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    },
    { passive: true }
  );
});