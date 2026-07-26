/* ===========================
   MENÚ RESPONSIVE
=========================== */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

}


/* ===========================
   CERRAR MENÚ AL NAVEGAR
=========================== */

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {
        navMenu?.classList.remove("active");
    });

});


/* ===========================
   CERRAR MENÚ AL REDIMENSIONAR
=========================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
        navMenu?.classList.remove("active");
    }

});