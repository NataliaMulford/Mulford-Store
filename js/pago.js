/* ===========================
   PAGO - MULFORD STORE
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("PÁGINA DE PAGO CARGADA");


    /* ===========================
       OBTENER DATOS
    =========================== */

    const checkoutData =
        JSON.parse(sessionStorage.getItem("checkoutData"));

    const carrito =
        JSON.parse(sessionStorage.getItem("carritoPago")) || [];


    console.log("DATOS DEL CHECKOUT:", checkoutData);
    console.log("CARRITO PARA PAGO:", carrito);


    /* ===========================
       ELEMENTOS
    =========================== */

    const pedidoTotal =
        document.getElementById("payment-order-total");

    const metodoPago =
        document.getElementById("payment-method");

    const contenidoPago =
        document.getElementById("payment-method-content");

    const confirmarPago =
        document.getElementById("confirmar-pago");

    const volverCheckout =
        document.getElementById("volver-checkout");

    const pedidoExitoso =
        document.getElementById("pedido-exitoso");

    const accionesPago =
        document.querySelector(".payment-actions");

    const pedidoExitosoId =
        document.getElementById("pedido-exitoso-id");

    const pedidoExitosoTotal =
        document.getElementById("pedido-exitoso-total");

    const pedidoExitosoMetodo =
        document.getElementById("pedido-exitoso-metodo");

    const volverTienda =
        document.getElementById("volver-tienda");


    /* ===========================
       VALIDAR DATOS
    =========================== */

    if (!checkoutData) {

        alert(
            "No se encontraron los datos del pedido."
        );

        window.location.href =
            "../catalogo.html";

        return;
    }


    if (carrito.length === 0) {

        alert(
            "No hay productos para procesar el pedido."
        );

        window.location.href =
            "../catalogo.html";

        return;
    }


    /* ===========================
       MOSTRAR TOTAL
    =========================== */

    const totalCompra =
        Number(checkoutData.totalCompra);


    if (pedidoTotal) {

        pedidoTotal.textContent =
            "$" +
            totalCompra.toLocaleString("es-CO");

    }


    /* ===========================
       MOSTRAR MÉTODO DE PAGO
    =========================== */

    let nombreMetodoPago = "Contraentrega";


    if (checkoutData.metodoPago === "nequi") {

        nombreMetodoPago = "Nequi";

    }
    else if (checkoutData.metodoPago === "bre-b") {

        nombreMetodoPago = "Bre-B";

    }


    if (metodoPago) {

        metodoPago.textContent =
            nombreMetodoPago;

    }


    /* ===========================
       INFORMACIÓN DEL PAGO
    =========================== */

    if (contenidoPago) {

        if (checkoutData.metodoPago === "nequi") {

            contenidoPago.innerHTML = `

                <div class="payment-info">

                    <h3>Pago mediante Nequi</h3>

                    <p>
                        Realiza el pago mediante Nequi
                        utilizando los datos indicados.
                    </p>

                    <p>
                        <strong>
                            Total a pagar:
                            $${totalCompra.toLocaleString("es-CO")}
                        </strong>
                    </p>

                </div>

            `;

        }

        else if (checkoutData.metodoPago === "bre-b") {

            contenidoPago.innerHTML = `

                <div class="payment-info">

                    <h3>Pago mediante Bre-B</h3>

                    <p>
                        Realiza el pago mediante Bre-B
                        utilizando los datos indicados.
                    </p>

                    <p>
                        <strong>
                            Total a pagar:
                            $${totalCompra.toLocaleString("es-CO")}
                        </strong>
                    </p>

                </div>

            `;

        }

        else if (checkoutData.metodoPago === "contraentrega") {

            contenidoPago.innerHTML = `

                <div class="payment-info">

                    <h3>Pago contraentrega</h3>

                    <p>
                        Pagarás cuando recibas tu pedido.
                    </p>

                    <p>
                        <strong>
                            Total a pagar:
                            $${totalCompra.toLocaleString("es-CO")}
                        </strong>
                    </p>

                </div>

            `;

        }

    }


    /* ===========================
       VOLVER
    =========================== */

    if (volverCheckout) {

        volverCheckout.addEventListener("click", () => {

            window.location.href =
                "../catalogo.html";

        });

    }


    /* ===========================
       CONFIRMAR PEDIDO
    =========================== */

    if (confirmarPago) {

        confirmarPago.addEventListener(
            "click",
            async () => {

                console.log(
                    "SE PRESIONÓ CONFIRMAR PEDIDO"
                );


                /* EVITAR DOBLE CLIC */

                confirmarPago.disabled = true;

                confirmarPago.textContent =
                    "Procesando...";


                try {

                    console.log(
                        "CREANDO PEDIDO EN BACKEND..."
                    );


                    /* ===========================
                       CREAR PEDIDO
                    =========================== */

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
                                        checkoutData.nombreCliente,

                                    telefono:
                                        checkoutData.telefono,

                                    direccion:
                                        checkoutData.direccion,

                                    ciudad:
                                        checkoutData.ciudad,

                                    metodoPago:
                                        checkoutData.metodoPago,

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
                            "Error al crear el pedido. HTTP " +
                            respuestaPedido.status
                        );

                    }


                    const pedido =
                        await respuestaPedido.json();


                    console.log(
                        "PEDIDO CREADO:",
                        pedido
                    );


                    /* ===========================
                       VALIDAR ID DEL PEDIDO
                    =========================== */

                    if (!pedido.id) {

                        throw new Error(
                            "El backend no devolvió el ID del pedido."
                        );

                    }

                                        /* ===========================
                       AGREGAR DETALLES DEL PEDIDO
                    =========================== */

                    for (const item of carrito) {

                        console.log(
                            "AGREGANDO PRODUCTO:",
                            item.id,
                            "CANTIDAD:",
                            item.cantidad
                        );


                        const respuestaDetalle =
                            await fetch(
                                `http://localhost:5146/api/Pedidos/${pedido.id}/detalles`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({

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


                        if (!respuestaDetalle.ok) {

                            throw new Error(
                                "Error al agregar el producto " +
                                item.id +
                                ". HTTP " +
                                respuestaDetalle.status
                            );

                        }

                    }


                    /* ===========================
                       PEDIDO COMPLETADO
                    =========================== */

                    console.log(
                        "PEDIDO COMPLETADO CORRECTAMENTE"
                    );


                    /* ===========================
                       LIMPIAR CARRITO
                    =========================== */

                    localStorage.removeItem(
                        "carrito"
                    );

                    sessionStorage.removeItem(
                        "carritoPago"
                    );

                    sessionStorage.removeItem(
                        "checkoutData"
                    );


                    /* ===========================
                       OCULTAR CONTENIDO DE PAGO
                    =========================== */

                    if (accionesPago) {

                        accionesPago.style.display =
                            "none";

                    }


                    if (contenidoPago) {

                        contenidoPago.style.display =
                            "none";

                    }


                    /* ===========================
                       MOSTRAR PEDIDO EXITOSO
                    =========================== */

                    if (pedidoExitoso) {

                        pedidoExitoso.style.display =
                            "block";

                    }


                    /* ===========================
                       INFORMACIÓN DEL PEDIDO
                    =========================== */

                    if (pedidoExitosoId) {

                        pedidoExitosoId.textContent =
                            pedido.id;

                    }


                    if (pedidoExitosoTotal) {

                        pedidoExitosoTotal.textContent =
                            "$" +
                            totalCompra.toLocaleString("es-CO");

                    }


                    if (pedidoExitosoMetodo) {

                        pedidoExitosoMetodo.textContent =
                            nombreMetodoPago;

                    }


                    /* ===========================
                       DESPLAZAR HACIA PEDIDO EXITOSO
                    =========================== */

                    if (pedidoExitoso) {

                        pedidoExitoso.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }


                    console.log(
                        "CARRITO LIMPIADO CORRECTAMENTE"
                    );

                }


                /* ===========================
                   ERROR
                =========================== */

                catch (error) {

                    console.error(
                        "ERROR AL CREAR PEDIDO:",
                        error
                    );


                    alert(
                        "No se pudo crear el pedido.\n\n" +
                        error.message
                    );


                    confirmarPago.disabled =
                        false;

                    confirmarPago.textContent =
                        "Confirmar pedido";

                }

            }
        );

    }

        /* ===========================
       VOLVER A LA TIENDA
    =========================== */

    if (volverTienda) {

        volverTienda.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../catalogo.html";

            }
        );

    }


    /* ===========================
       FIN
    =========================== */

    console.log(
        "PAGO.JS INICIADO CORRECTAMENTE"
    );

});