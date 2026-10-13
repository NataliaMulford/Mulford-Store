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


/* ===========================
   MODAL FINALIZAR COMPRA
=========================== */

const checkoutModal = document.getElementById("checkout-modal");
const finalizarCompra = document.getElementById("finalizar-compra");
const cerrarCheckout = document.getElementById("cerrar-checkout");
const cancelarCheckout = document.getElementById("cancelar-checkout");
const checkoutOverlay = document.querySelector(".checkout-overlay");


/* ===========================
   OCULTAR MODAL AL CARGAR
=========================== */

if (checkoutModal) {
    checkoutModal.hidden = true;
}


/* ===========================
   ABRIR FINALIZAR COMPRA
=========================== */

if (finalizarCompra && checkoutModal) {

    finalizarCompra.addEventListener("click", () => {

        checkoutModal.hidden = false;

        document.body.classList.add("checkout-abierto");

    });

}


/* ===========================
   CERRAR MODAL
=========================== */

function cerrarModalCheckout() {

    if (!checkoutModal) return;

    checkoutModal.hidden = true;

    document.body.classList.remove("checkout-abierto");

}


/* ===========================
   BOTÓN X
=========================== */

if (cerrarCheckout) {

    cerrarCheckout.addEventListener("click", () => {

        cerrarModalCheckout();

    });

}


/* ===========================
   VOLVER AL CARRITO
=========================== */

if (cancelarCheckout) {

    cancelarCheckout.addEventListener("click", () => {

        cerrarModalCheckout();

    });

}


/* ===========================
   CERRAR HACIENDO CLIC
   EN EL FONDO
=========================== */

if (checkoutOverlay) {

    checkoutOverlay.addEventListener("click", () => {

        cerrarModalCheckout();

    });

}


/* ===========================
   CERRAR CON ESC
=========================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        cerrarModalCheckout();

    }

});