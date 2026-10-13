let listaProductos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cantidades = {};


/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function cargarProductos() {

    try {

        const respuesta = await fetch(
            "http://localhost:5146/api/Productos"
        );

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        listaProductos = await respuesta.json();

        /*
         * Descontar visualmente del stock
         * lo que ya está en el carrito.
         */

        carrito.forEach(item => {

            const producto = listaProductos.find(
                p => p.id === item.id
            );

            if (producto) {
                producto.stock -= item.cantidad;
            }

        });

        mostrarProductos(listaProductos);

        actualizarContadorCarrito();

        mostrarCarrito();

        activarBuscador();

        activarFiltros();

        aplicarCategoriaDesdeURL();

    } catch (error) {

        console.error(
            "Error al cargar los productos:",
            error
        );

    }

}


/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function mostrarProductos(productos) {

    const contenedor =
        document.getElementById("contenedor-productos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    productos.forEach(producto => {

        if (!cantidades[producto.id]) {
            cantidades[producto.id] = 1;
        }

        contenedor.innerHTML += `

            <article class="product-card">

                <a
                    href="producto.html?id=${producto.id}"
                    class="product-link"
                >

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        loading="lazy"
                    >

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p class="product-reference">
                        Ref. ${producto.referencia}
                    </p>

                    <p class="product-tone">
                        Tono: ${producto.tono}
                    </p>

                    <p class="product-stock">
                        Disponibles: ${producto.stock}
                    </p>

                </a>


                ${producto.stock > 0 ? `
    <div class="quantity-selector">
        <button
            type="button"
            class="qty-btn"
            data-action="menos"
            data-id="${producto.id}"
        >
            −
        </button>

        <span
            class="qty-value"
            data-id="${producto.id}"
        >
            ${cantidades[producto.id]}
        </span>

        <button
            type="button"
            class="qty-btn"
            data-action="mas"
            data-id="${producto.id}"
        >
            +
        </button>
    </div>
` : ""}


                <p class="price">
                    $${producto.precio.toLocaleString("es-CO")}
                </p>


                <button
    type="button"
    class="btn btn-primary btn-comprar ${producto.stock === 0 ? "agotado" : ""}"
    data-id="${producto.id}"
    ${producto.stock === 0 ? "disabled" : ""}
>
    ${producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
</button>

            </article>

        `;

    });

    activarSelectorCantidad();

    activarBotonesComprar();

}


/* =========================================================
   AGREGAR AL CARRITO
========================================================= */

function activarBotonesComprar() {

    const botones =
        document.querySelectorAll(".btn-comprar");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id =
                Number(boton.dataset.id);

            const producto =
                listaProductos.find(
                    p => p.id === id
                );

            if (!producto) return;

            const cantidad =
                cantidades[id] || 1;


            if (cantidad <= 0) {

                alert(
                    "La cantidad debe ser mayor que cero."
                );

                return;

            }


            if (cantidad > producto.stock) {

                alert(
                    `Solo quedan ${producto.stock} unidades disponibles.`
                );

                return;

            }


            const existe =
                carrito.find(
                    item => item.id === id
                );


            if (existe) {

                existe.cantidad += cantidad;

            } else {

                carrito.push({

                    id: producto.id,

                    nombre: producto.nombre,

                    precio: producto.precio,

                    imagen: producto.imagen,

                    cantidad: cantidad

                });

            }


            producto.stock -= cantidad;


            guardarCarrito();

            actualizarContadorCarrito();

            mostrarProductos(listaProductos);

            mostrarCarrito();

        });

    });

}


/* =========================================================
   CONTADOR DEL CARRITO
========================================================= */

function actualizarContadorCarrito() {

    const contador =
        document.getElementById("contador-carrito");

    if (!contador) return;

    const totalProductos =
        carrito.reduce(
            (total, item) =>
                total + item.cantidad,
            0
        );

    contador.textContent =
        totalProductos;

}


/* =========================================================
   SELECTOR DE CANTIDAD
========================================================= */

function activarSelectorCantidad() {

    const botones =
        document.querySelectorAll(".qty-btn");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id =
                Number(boton.dataset.id);

            if (!cantidades[id]) {
                cantidades[id] = 1;
            }

            const producto =
                listaProductos.find(
                    p => p.id === id
                );

            if (!producto) return;


            if (
                boton.dataset.action === "mas"
            ) {

                if (
                    cantidades[id] <
                    producto.stock
                ) {

                    cantidades[id]++;

                } else {

                    alert(
                        `Solo quedan ${producto.stock} unidades disponibles.`
                    );

                }

            } else {

                if (cantidades[id] > 1) {
                    cantidades[id]--;
                }

            }


            const valor =
                document.querySelector(
                    `.qty-value[data-id="${id}"]`
                );

            if (valor) {
                valor.textContent =
                    cantidades[id];
            }

        });

    });

}


/* =========================================================
   PANEL DEL CARRITO
========================================================= */

function activarCarrito() {

    const botonCarrito =
        document.querySelector(".carrito-btn");

    const panel =
        document.getElementById("carrito-panel");

    const cerrar =
        document.getElementById("cerrar-carrito");

    const botonVaciar =
        document.getElementById("vaciar-carrito");


    if (!botonCarrito || !panel) return;


    /* ABRIR */

    botonCarrito.addEventListener("click", () => {

        panel.classList.add("activo");

    });


    /* CERRAR */

    if (cerrar) {

        cerrar.addEventListener("click", () => {

            panel.classList.remove("activo");

        });

    }


    /* VACIAR */

    if (botonVaciar) {

        botonVaciar.addEventListener("click", () => {

            carrito.forEach(item => {

                const producto =
                    listaProductos.find(
                        p => p.id === item.id
                    );

                if (producto) {

                    producto.stock +=
                        item.cantidad;

                }

            });


            carrito = [];


            guardarCarrito();

            mostrarProductos(listaProductos);

            actualizarContadorCarrito();

            mostrarCarrito();

        });

    }

}


/* =========================================================
   MOSTRAR CARRITO
========================================================= */

function mostrarCarrito() {

    const lista =
        document.getElementById("lista-carrito");

    const total =
        document.getElementById("total-carrito");

    if (!lista || !total) return;

    lista.innerHTML = "";

    let totalCompra = 0;

    if (carrito.length === 0) {

        lista.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        total.textContent = "$0";

        return;
    }

    carrito.forEach(producto => {

        const subtotal =
            producto.precio *
            producto.cantidad;

        totalCompra += subtotal;

        lista.innerHTML += `

            <div class="item-carrito">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

                <div class="carrito-info">

                    <h4>
                        ${producto.nombre}
                    </h4>

                    <div class="carrito-controles">

                        <div class="cantidad-carrito">

                            <button
                                type="button"
                                class="btn-restar"
                                data-id="${producto.id}"
                            >
                                −
                            </button>

                            <span>
                                ${producto.cantidad}
                            </span>

                            <button
                                type="button"
                                class="btn-sumar"
                                data-id="${producto.id}"
                            >
                                +
                            </button>

                        </div>

                        <p class="precio-carrito">
                            $${subtotal.toLocaleString("es-CO")}
                        </p>

                        <button
                            type="button"
                            class="btn-eliminar"
                            data-id="${producto.id}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

    total.textContent =
        "$" +
        totalCompra.toLocaleString("es-CO");

    activarBotonesCarrito();

}


/* =========================================================
   BOTONES DEL CARRITO
========================================================= */

function activarBotonesCarrito() {

    const botonesSumar =
        document.querySelectorAll(".btn-sumar");

    const botonesRestar =
        document.querySelectorAll(".btn-restar");

    const botonesEliminar =
        document.querySelectorAll(".btn-eliminar");


    /* SUMAR */

    botonesSumar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id =
                Number(boton.dataset.id);

            const item =
                carrito.find(
                    producto =>
                        producto.id === id
                );

            const producto =
                listaProductos.find(
                    producto =>
                        producto.id === id
                );

            if (!item || !producto) return;


            if (producto.stock > 0) {

                item.cantidad++;

                producto.stock--;

                guardarCarrito();

                mostrarProductos(listaProductos);

                actualizarContadorCarrito();

                mostrarCarrito();

            } else {

                alert(
                    "No hay más unidades disponibles."
                );

            }

        });

    });


    /* RESTAR */

    botonesRestar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id =
                Number(boton.dataset.id);

            const item =
                carrito.find(
                    producto =>
                        producto.id === id
                );

            const producto =
                listaProductos.find(
                    producto =>
                        producto.id === id
                );

            if (!item || !producto) return;


            item.cantidad--;

            producto.stock++;


            if (item.cantidad <= 0) {

                carrito =
                    carrito.filter(
                        producto =>
                            producto.id !== id
                    );

            }


            guardarCarrito();

            mostrarProductos(listaProductos);

            actualizarContadorCarrito();

            mostrarCarrito();

        });

    });


    /* ELIMINAR */

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id =
                Number(boton.dataset.id);

            const item =
                carrito.find(
                    producto =>
                        producto.id === id
                );

            const producto =
                listaProductos.find(
                    producto =>
                        producto.id === id
                );

            if (!item || !producto) return;


            producto.stock +=
                item.cantidad;


            carrito =
                carrito.filter(
                    producto =>
                        producto.id !== id
                );


            guardarCarrito();

            mostrarProductos(listaProductos);

            actualizarContadorCarrito();

            mostrarCarrito();

        });

    });

}


/* =========================================================
   GUARDAR CARRITO
========================================================= */

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =========================================================
   BUSCADOR
========================================================= */

function activarBuscador() {

    const buscador =
        document.getElementById("buscador");

    if (!buscador) return;


    buscador.addEventListener(
        "input",
        () => {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();


            const resultado =
                listaProductos.filter(
                    producto =>

                        producto.nombre
                            .toLowerCase()
                            .includes(texto)

                        ||

                        producto.referencia
                            .toLowerCase()
                            .includes(texto)

                        ||

                        producto.categoria
                            .toLowerCase()
                            .includes(texto)

                );


            mostrarProductos(resultado);

        }
    );

}


/* =========================================================
   FILTROS
========================================================= */

function activarFiltros() {

    const botones =
        document.querySelectorAll(
            ".filter-btn"
        );

    if (!botones.length) return;


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                botones.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                boton.classList.add(
                    "active"
                );


                const categoria =
                    boton.dataset.category;


                if (categoria === "Todos") {

                    mostrarProductos(
                        listaProductos
                    );

                    return;

                }


                const filtrados =
                    listaProductos.filter(
                        producto =>
                            producto.categoria ===
                            categoria
                    );


                mostrarProductos(
                    filtrados
                );

            }
        );

    });

}


/* =========================================================
   CATEGORÍA DESDE URL
========================================================= */

function aplicarCategoriaDesdeURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const categoria =
        parametros.get("categoria");


    if (!categoria) return;


    console.log(
        "Categoría recibida:",
        categoria
    );


    const botonActivo =
        document.querySelector(
            `.filter-btn[data-category="${categoria}"]`
        );


    if (!botonActivo) return;


    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    botonActivo.classList.add(
        "active"
    );


    const productosFiltrados =
        listaProductos.filter(
            producto =>
                producto.categoria ===
                categoria
        );


    mostrarProductos(
        productosFiltrados
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botonFinalizarCompra =
            document.getElementById(
                "finalizar-compra"
            );

        const checkout =
            document.getElementById(
                "checkout-modal"
            );

        const cerrarCheckout =
            document.getElementById(
                "cerrar-checkout"
            );

        const cancelarCheckout =
            document.getElementById(
                "cancelar-checkout"
            );

        const formulario =
            document.getElementById(
                "checkout-form"
            );

        const paymentStep =
            document.getElementById(
                "payment-step"
            );

        const confirmarPago =
            document.getElementById(
                "confirmar-pago"
            );

        const volverMetodoPago =
            document.getElementById(
                "volver-metodo-pago"
            );

        const cerrarPedidoExitoso =
            document.getElementById(
                "cerrar-pedido-exitoso"
            );


        console.log(
            "CHECKOUT CARGADO"
        );

        console.log(
            "Botón finalizar:",
            botonFinalizarCompra
        );

        console.log(
            "Modal:",
            checkout
        );


        /* =====================================================
           ABRIR CHECKOUT
        ===================================================== */

        if (
            botonFinalizarCompra &&
            checkout
        ) {

            botonFinalizarCompra.addEventListener(
                "click",
                () => {

                    console.log(
                        "SE PRESIONÓ FINALIZAR COMPRA"
                    );


                    if (carrito.length === 0) {

                        alert(
                            "Tu carrito está vacío."
                        );

                        return;

                    }


                    const carritoPanel =
                        document.getElementById(
                            "carrito-panel"
                        );


                    if (carritoPanel) {

                        carritoPanel.classList.remove(
                            "activo"
                        );

                    }


                    mostrarResumenCheckout();


                    /* RESTAURAR PRIMER PASO */

                    mostrarPasoCheckout();


                    /* ABRIR MODAL */

                    checkout.classList.add(
                        "activo"
                    );


                    document.body.style.overflow =
                        "hidden";

                }
            );

        }


        /* =====================================================
           CERRAR CHECKOUT
        ===================================================== */

        if (
            cerrarCheckout &&
            checkout
        ) {

            cerrarCheckout.addEventListener(
                "click",
                () => {

                    cerrarCheckoutCompleto();

                }
            );

        }


        /* =====================================================
           VOLVER AL CARRITO
        ===================================================== */

        if (
            cancelarCheckout &&
            checkout
        ) {

            cancelarCheckout.addEventListener(
                "click",
                () => {

                    cerrarCheckoutCompleto();

                    const carritoPanel =
                        document.getElementById(
                            "carrito-panel"
                        );

                    if (carritoPanel) {

                        carritoPanel.classList.add(
                            "activo"
                        );

                    }

                }
            );

        }


        /* =====================================================
           CONTINUAR AL PAGO
        ===================================================== */

        if (formulario) {

            formulario.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    console.log(
                        "SE PRESIONÓ CONTINUAR AL PAGO"
                    );


                    if (carrito.length === 0) {

                        alert(
                            "El carrito está vacío."
                        );

                        return;

                    }


                    /* DATOS CLIENTE */

                    const nombreCliente =
                        document
                            .getElementById(
                                "nombre-cliente"
                            )
                            ?.value
                            .trim();


                    const telefono =
                        document
                            .getElementById(
                                "telefono"
                            )
                            ?.value
                            .trim();


                    const direccion =
                        document
                            .getElementById(
                                "direccion"
                            )
                            ?.value
                            .trim();


                    const ciudad =
                        document
                            .getElementById(
                                "ciudad"
                            )
                            ?.value
                            .trim();


                    if (
                        !nombreCliente ||
                        !telefono ||
                        !direccion ||
                        !ciudad
                    ) {

                        alert(
                            "Completa todos los datos de entrega."
                        );

                        return;

                    }


                    /* MÉTODO DE PAGO */

                    const metodoPago =
                        document.querySelector(
                            'input[name="metodoPago"]:checked'
                        )?.value;


                    if (!metodoPago) {

                        alert(
                            "Selecciona un método de pago."
                        );

                        return;

                    }


                    /* TOTAL */

                    const totalCompra =
                        carrito.reduce(
                            (total, item) =>
                                total +
                                (
                                    item.precio *
                                    item.cantidad
                                ),
                            0
                        );


                    /* GUARDAR DATOS */

                    window.checkoutData = {

                        nombreCliente,

                        telefono,

                        direccion,

                        ciudad,

                        metodoPago,

                        totalCompra

                    };


                    console.log(
                        "DATOS CHECKOUT:",
                        window.checkoutData
                    );


                    /* =================================================
                       PREPARAR PAGO
                    ================================================= */

                    const paymentContent =
                        document.getElementById(
                            "payment-content"
                        );

                    const paymentTotal =
                        document.getElementById(
                            "payment-total"
                        );


                    if (paymentTotal) {

                        paymentTotal.textContent =
                            "$" +
                            totalCompra.toLocaleString(
                                "es-CO"
                            );

                    }


                    if (paymentContent) {

                        let contenido = "";


                        if (
                            metodoPago ===
                            "nequi"
                        ) {

                            contenido = `

                                <div class="payment-info">

                                    <h4>
                                        Pago mediante Nequi
                                    </h4>

                                    <p>
                                        Realiza el pago mediante
                                        Nequi utilizando los datos
                                        indicados por la tienda.
                                    </p>

                                    <p>
                                        <strong>
                                            Método seleccionado:
                                        </strong>
                                        Nequi
                                    </p>

                                </div>

                            `;

                        }


                        else if (
                            metodoPago ===
                            "bre-b"
                        ) {

                            contenido = `

                                <div class="payment-info">

                                    <h4>
                                        Pago mediante Bre-B
                                    </h4>

                                    <p>
                                        Realiza el pago mediante
                                        Bre-B utilizando los datos
                                        indicados por la tienda.
                                    </p>

                                    <p>
                                        <strong>
                                            Método seleccionado:
                                        </strong>
                                        Bre-B
                                    </p>

                                </div>

                            `;

                        }


                        else {

                            contenido = `

                                <div class="payment-info">

                                    <h4>
                                        Pago contraentrega
                                    </h4>

                                    <p>
                                        Pagarás cuando recibas
                                        tu pedido.
                                    </p>

                                    <p>
                                        <strong>
                                            Método seleccionado:
                                        </strong>
                                        Contraentrega
                                    </p>

                                </div>

                            `;

                        }


                        paymentContent.innerHTML =
                            contenido;

                    }


                    /* =================================================
                       MOSTRAR PASO DE PAGO
                    ================================================= */

                    document
                        .getElementById(
                            "checkout-datos"
                        )
                        ?.style.setProperty(
                            "display",
                            "none"
                        );


                    document
                        .getElementById(
                            "checkout-resumen-section"
                        )
                        ?.style.setProperty(
                            "display",
                            "none"
                        );


                    document
                        .getElementById(
                            "checkout-metodo-section"
                        )
                        ?.style.setProperty(
                            "display",
                            "none"
                        );


                    document
                        .querySelector(
                            ".checkout-actions"
                        )
                        ?.style.setProperty(
                            "display",
                            "none"
                        );


                    if (paymentStep) {

                        paymentStep.style.display =
                            "block";

                    }


                    /*
                     * IMPORTANTE:
                     * YA NO HACEMOS:
                     *
                     * window.location.href =
                     * "pages/pago.html";
                     *
                     * El pago permanece dentro
                     * del mismo modal.
                     */

                }
            );

        }


        /* =====================================================
           VOLVER AL MÉTODO DE PAGO
        ===================================================== */

        if (volverMetodoPago) {

            volverMetodoPago.addEventListener(
                "click",
                () => {

                    mostrarPasoCheckout();

                }
            );

        }


        /* =====================================================
           CONFIRMAR PEDIDO
        ===================================================== */

        if (confirmarPago) {

            confirmarPago.addEventListener(
                "click",
                async () => {

                    console.log(
                        "SE PRESIONÓ CONFIRMAR PEDIDO"
                    );


                    if (!window.checkoutData) {

                        alert(
                            "No se encontraron los datos del pedido."
                        );

                        return;

                    }


                    const {

                        nombreCliente,

                        telefono,

                        direccion,

                        ciudad,

                        metodoPago,

                        totalCompra

                    } = window.checkoutData;


                    try {

                        console.log(
                            "CREANDO PEDIDO..."
                        );


                        /* =================================================
                           CREAR PEDIDO
                        ================================================= */

                        const respuestaPedido =
                            await fetch(
                                "http://localhost:5146/api/Pedidos",
                                {

                                    method: "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body: JSON.stringify({

                                        nombreCliente:
                                            nombreCliente,

                                        telefono:
                                            telefono,

                                        direccion:
                                            direccion,

                                        ciudad:
                                            ciudad,

                                        metodoPago:
                                            metodoPago,

                                        total:
                                            totalCompra

                                    })

                                }
                            );


                        console.log(
                            "RESPUESTA PEDIDO:",
                            respuestaPedido.status
                        );


                        if (!respuestaPedido.ok) {

                            throw new Error(
                                "Error al crear pedido. HTTP " +
                                respuestaPedido.status
                            );

                        }


                        const pedido =
                            await respuestaPedido.json();


                        console.log(
                            "PEDIDO CREADO:",
                            pedido
                        );


                        /* =================================================
                           AGREGAR DETALLES
                        ================================================= */

                        for (
                            const item
                            of carrito
                        ) {

                            const respuestaDetalle =
                                await fetch(
                                    `http://localhost:5146/api/Pedidos/${pedido.id}/detalles`,
                                    {

                                        method: "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                productoId:
                                                    item.id,

                                                cantidad:
                                                    item.cantidad

                                            })

                                    }
                                );


                            console.log(
                                "RESPUESTA DETALLE:",
                                respuestaDetalle.status
                            );


                            if (
                                !respuestaDetalle.ok
                            ) {

                                throw new Error(
                                    "Error al agregar producto " +
                                    item.id +
                                    ". HTTP " +
                                    respuestaDetalle.status
                                );

                            }

                        }


                        /* =================================================
                           MOSTRAR PEDIDO EXITOSO
                        ================================================= */

                        const pedidoExitoso =
                            document.getElementById(
                                "pedido-exitoso"
                            );

                        const pedidoExitosoId =
                            document.getElementById(
                                "pedido-exitoso-id"
                            );

                        const pedidoExitosoTotal =
                            document.getElementById(
                                "pedido-exitoso-total"
                            );

                        const pedidoExitosoMetodo =
                            document.getElementById(
                                "pedido-exitoso-metodo"
                            );

                        const paymentContent =
                            document.getElementById(
                                "payment-content"
                            );

                        const paymentTotalElement =
                            document.querySelector(
                                ".payment-total"
                            );

                        const paymentActions =
                            document.querySelector(
                                ".payment-actions"
                            );


                        /* OCULTAR PAGO */

                        if (paymentContent) {

                            paymentContent.style.display =
                                "none";

                        }


                        if (
                            paymentTotalElement
                        ) {

                            paymentTotalElement.style.display =
                                "none";

                        }


                        if (paymentActions) {

                            paymentActions.style.display =
                                "none";

                        }


                        /* MOSTRAR ÉXITO */

                        if (pedidoExitoso) {

                            pedidoExitoso.style.display =
                                "block";

                        }


                        if (pedidoExitosoId) {

                            pedidoExitosoId.textContent =
                                pedido.id;

                        }


                        if (pedidoExitosoTotal) {

                            pedidoExitosoTotal.textContent =
                                "$" +
                                totalCompra.toLocaleString(
                                    "es-CO"
                                );

                        }


                        if (pedidoExitosoMetodo) {

                            pedidoExitosoMetodo.textContent =
                                obtenerNombreMetodoPago(
                                    metodoPago
                                );

                        }


                        /* =================================================
                           VACIAR CARRITO
                        ================================================= */

                        carrito = [];

                        guardarCarrito();

                        actualizarContadorCarrito();

                        mostrarCarrito();


                        console.log(
                            "PEDIDO CREADO CORRECTAMENTE"
                        );

                    }

                    catch (error) {

                        console.error(
                            "ERROR AL CREAR PEDIDO:",
                            error
                        );


                        alert(
                            "No se pudo crear el pedido.\n\n" +
                            error.message
                        );

                    }

                }
            );

        }


        /* =====================================================
           CERRAR PEDIDO EXITOSO
        ===================================================== */

        if (cerrarPedidoExitoso) {

            cerrarPedidoExitoso.addEventListener(
                "click",
                () => {

                    cerrarCheckoutCompleto();

                }
            );

        }


        /* =====================================================
           FUNCIONES INTERNAS DEL CHECKOUT
        ===================================================== */

        function mostrarPasoCheckout() {

            const datos =
                document.getElementById(
                    "checkout-datos"
                );

            const resumen =
                document.getElementById(
                    "checkout-resumen-section"
                );

            const metodo =
                document.getElementById(
                    "checkout-metodo-section"
                );

            const acciones =
                document.querySelector(
                    ".checkout-actions"
                );

            const payment =
                document.getElementById(
                    "payment-step"
                );

            const pedidoExitoso =
                document.getElementById(
                    "pedido-exitoso"
                );

            const paymentContent =
                document.getElementById(
                    "payment-content"
                );

            const paymentTotalElement =
                document.querySelector(
                    ".payment-total"
                );

            const paymentActions =
                document.querySelector(
                    ".payment-actions"
                );


            if (datos) {

                datos.style.display =
                    "block";

            }


            if (resumen) {

                resumen.style.display =
                    "block";

            }


            if (metodo) {

                metodo.style.display =
                    "block";

            }


            if (acciones) {

                acciones.style.display =
                    "flex";

            }


            if (payment) {

                payment.style.display =
                    "none";

            }


            if (pedidoExitoso) {

                pedidoExitoso.style.display =
                    "none";

            }


            if (paymentContent) {

                paymentContent.style.display =
                    "block";

            }


            if (paymentTotalElement) {

                paymentTotalElement.style.display =
                    "flex";

            }


            if (paymentActions) {

                paymentActions.style.display =
                    "flex";

            }

        }


        function cerrarCheckoutCompleto() {

            if (checkout) {

                checkout.classList.remove(
                    "activo"
                );

            }


            document.body.style.overflow =
                "";


            mostrarPasoCheckout();

        }


        function obtenerNombreMetodoPago(
            metodo
        ) {

            if (
                metodo === "nequi"
            ) {

                return "Nequi";

            }


            if (
                metodo === "bre-b"
            ) {

                return "Bre-B";

            }


            return "Contraentrega";

        }


        /* =====================================================
           MOSTRAR RESUMEN
        ===================================================== */

        function mostrarResumenCheckout() {

            const resumen =
                document.getElementById(
                    "checkout-resumen"
                );

            const total =
                document.getElementById(
                    "checkout-total"
                );


            if (
                !resumen ||
                !total
            ) {

                console.error(
                    "No se encontró checkout-resumen o checkout-total."
                );

                return;

            }


            resumen.innerHTML = "";

            let totalCompra = 0;


            carrito.forEach(item => {

                const subtotal =
                    item.precio *
                    item.cantidad;


                totalCompra +=
                    subtotal;


                resumen.innerHTML += `

                    <div class="checkout-item">

                        <img
                            src="${item.imagen}"
                            alt="${item.nombre}"
                        >

                        <div>

                            <strong>
                                ${item.nombre}
                            </strong>

                            <p>
                                Cantidad:
                                ${item.cantidad}
                            </p>

                            <p>
                                $${subtotal.toLocaleString("es-CO")}
                            </p>

                        </div>

                    </div>

                `;

            });


            total.textContent =
                "$" +
                totalCompra.toLocaleString(
                    "es-CO"
                );

        }

    }
);


/* =========================================================
   INICIAR APLICACIÓN
========================================================= */

cargarProductos();

activarCarrito();