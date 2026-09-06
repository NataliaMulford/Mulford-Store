let listaProductos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cantidades = {};


/* ===========================
   CARGAR PRODUCTOS DESDE API
=========================== */

async function cargarProductos() {

    try {

        const respuesta = await fetch("http://localhost:5146/api/Productos");

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        listaProductos = await respuesta.json();

        /*
         * El stock que viene de la API es el stock real.
         * Para mostrar las unidades que todavía están disponibles
         * después de agregarlas al carrito, descontamos temporalmente
         * las cantidades que ya están guardadas en localStorage.
         */

        carrito.forEach(item => {

            const producto = listaProductos.find(p => p.id === item.id);

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
            "Error al cargar los productos desde la API:",
            error
        );

    }

}


/* ===========================
   MOSTRAR PRODUCTOS
=========================== */

function mostrarProductos(productos) {

    const contenedor = document.getElementById("contenedor-productos");

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


                <p class="price">
                    $${producto.precio.toLocaleString("es-CO")}
                </p>


                <button
                    type="button"
                    class="btn btn-primary btn-comprar"
                    data-id="${producto.id}"
                >
                    Agregar al carrito
                </button>

            </article>

        `;

    });

    activarSelectorCantidad();

    activarBotonesComprar();

}


/* ===========================
   BOTONES AGREGAR AL CARRITO
=========================== */

function activarBotonesComprar() {

    const botones = document.querySelectorAll(".btn-comprar");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const producto = listaProductos.find(
                p => p.id === id
            );

            if (!producto) return;

            const cantidad = cantidades[id] || 1;


            if (cantidad <= 0) {

                alert("La cantidad debe ser mayor que cero.");

                return;

            }


            if (cantidad > producto.stock) {

                alert(
                    `Solo quedan ${producto.stock} unidades disponibles.`
                );

                return;

            }


            const existe = carrito.find(
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


            /*
             * Descuento visual/local.
             * El descuento definitivo del inventario
             * lo hará posteriormente la API al crear
             * los detalles del pedido.
             */

            producto.stock -= cantidad;


            guardarCarrito();

            actualizarContadorCarrito();

            mostrarProductos(listaProductos);

            mostrarCarrito();

        });

    });

}

/* ===========================
   CONTADOR DEL CARRITO
=========================== */

function actualizarContadorCarrito() {

    const contador = document.getElementById("contador-carrito");

    if (!contador) return;

    const totalProductos = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    contador.textContent = totalProductos;

}


/* ===========================
   SELECTOR DE CANTIDAD
=========================== */

function activarSelectorCantidad() {

    const botones = document.querySelectorAll(".qty-btn");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            if (!cantidades[id]) {
                cantidades[id] = 1;
            }

            const producto = listaProductos.find(
                p => p.id === id
            );

            if (!producto) return;


            /* AUMENTAR */

            if (boton.dataset.action === "mas") {

                if (cantidades[id] < producto.stock) {

                    cantidades[id]++;

                } else {

                    alert(
                        `Solo quedan ${producto.stock} unidades disponibles.`
                    );

                }

            }


            /* DISMINUIR */

            else {

                if (cantidades[id] > 1) {

                    cantidades[id]--;

                }

            }


            const valor = document.querySelector(
                `.qty-value[data-id="${id}"]`
            );

            if (valor) {

                valor.textContent = cantidades[id];

            }

        });

    });

}


/* ===========================
   ACTIVAR PANEL DEL CARRITO
=========================== */

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


    /* ABRIR CARRITO */

    botonCarrito.addEventListener("click", () => {

        panel.classList.add("activo");

    });


    /* CERRAR CARRITO */

    if (cerrar) {

        cerrar.addEventListener("click", () => {

            panel.classList.remove("activo");

        });

    }


    /* VACIAR CARRITO */

    if (botonVaciar) {

        botonVaciar.addEventListener("click", () => {

            carrito.forEach(item => {

                const producto = listaProductos.find(
                    p => p.id === item.id
                );

                if (producto) {

                    producto.stock += item.cantidad;

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


/* ===========================
   MOSTRAR CARRITO
=========================== */

function mostrarCarrito() {

    const lista =
        document.getElementById("lista-carrito");

    const total =
        document.getElementById("total-carrito");


    if (!lista || !total) return;


    lista.innerHTML = "";

    let totalCompra = 0;


    /* CARRITO VACÍO */

    if (carrito.length === 0) {

        lista.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        total.textContent = "$0";

        return;

    }


    /* PRODUCTOS DEL CARRITO */

    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;

        totalCompra += subtotal;


        lista.innerHTML += `

            <div class="item-carrito">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <div>

                    <h4>
                        ${producto.nombre}
                    </h4>


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


                    <p>
                        $${subtotal.toLocaleString("es-CO")}
                    </p>


                    <button
                        type="button"
                        class="btn-eliminar"
                        data-id="${producto.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });


    total.textContent =
        "$" + totalCompra.toLocaleString("es-CO");


    activarBotonesCarrito();

}

/* ===========================
   BOTONES DEL CARRITO
=========================== */

function activarBotonesCarrito() {

    const botonesSumar =
        document.querySelectorAll(".btn-sumar");

    const botonesRestar =
        document.querySelectorAll(".btn-restar");

    const botonesEliminar =
        document.querySelectorAll(".btn-eliminar");


    /* ===========================
       SUMAR PRODUCTO
    =========================== */

    botonesSumar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(
                producto => producto.id === id
            );

            const producto = listaProductos.find(
                producto => producto.id === id
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


    /* ===========================
       RESTAR PRODUCTO
    =========================== */

    botonesRestar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(
                producto => producto.id === id
            );

            const producto = listaProductos.find(
                producto => producto.id === id
            );

            if (!item || !producto) return;


            item.cantidad--;

            producto.stock++;


            if (item.cantidad <= 0) {

                carrito = carrito.filter(
                    producto => producto.id !== id
                );

            }


            guardarCarrito();

            mostrarProductos(listaProductos);

            actualizarContadorCarrito();

            mostrarCarrito();

        });

    });


    /* ===========================
       ELIMINAR PRODUCTO
    =========================== */

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(
                producto => producto.id === id
            );

            const producto = listaProductos.find(
                producto => producto.id === id
            );

            if (!item || !producto) return;


            producto.stock += item.cantidad;


            carrito = carrito.filter(
                producto => producto.id !== id
            );


            guardarCarrito();

            mostrarProductos(listaProductos);

            actualizarContadorCarrito();

            mostrarCarrito();

        });

    });

}


/* ===========================
   GUARDAR CARRITO
=========================== */

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* ===========================
   BUSCADOR
=========================== */

function activarBuscador() {

    const buscador =
        document.getElementById("buscador");

    if (!buscador) return;


    buscador.addEventListener("input", () => {

        const texto =
            buscador.value.toLowerCase().trim();


        const resultado =
            listaProductos.filter(producto =>

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

    });

}


/* ===========================
   FILTROS POR CATEGORÍA
=========================== */

function activarFiltros() {

    const botones =
        document.querySelectorAll(".filter-btn");

    if (!botones.length) return;


    botones.forEach(boton => {

        boton.addEventListener("click", () => {


            botones.forEach(btn => {

                btn.classList.remove("active");

            });


            boton.classList.add("active");


            const categoria =
                boton.dataset.category;


            if (categoria === "Todos") {

                mostrarProductos(listaProductos);

                return;

            }


            const filtrados =
                listaProductos.filter(
                    producto =>
                        producto.categoria === categoria
                );


            mostrarProductos(filtrados);

        });

    });

}


/* ===========================
   CATEGORÍA DESDE URL
=========================== */

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

            btn.classList.remove("active");

        });


    botonActivo.classList.add("active");


    const productosFiltrados =
        listaProductos.filter(
            producto =>
                producto.categoria === categoria
        );


    mostrarProductos(productosFiltrados);

}


/* ===========================
   INICIAR APLICACIÓN
=========================== */

cargarProductos();

activarCarrito();


/* ===========================
   BOTÓN FINALIZAR COMPRA
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    const botonFinalizarCompra =
        document.getElementById("finalizar-compra");

    if (!botonFinalizarCompra) {

        console.error(
            "No se encontró el botón #finalizar-compra"
        );

        return;
    }

    console.log("BOTÓN FINALIZAR COMPRA ENCONTRADO");

    botonFinalizarCompra.addEventListener("click", async () => {

        console.log("CLICK EN FINALIZAR COMPRA");

        /* ===========================
           VALIDAR CARRITO
        =========================== */

        if (carrito.length === 0) {

            alert("Tu carrito está vacío.");

            return;
        }


        /* ===========================
           DATOS DEL CLIENTE
        =========================== */

        const nombreCliente =
            prompt("Nombre del cliente:");

        if (!nombreCliente) {
            alert("Debes ingresar el nombre del cliente.");
            return;
        }


        const telefono =
            prompt("Teléfono:");

        if (!telefono) {
            alert("Debes ingresar el teléfono.");
            return;
        }


        const direccion =
            prompt("Dirección:");

        if (!direccion) {
            alert("Debes ingresar la dirección.");
            return;
        }


        const ciudad =
            prompt("Ciudad:");

        if (!ciudad) {
            alert("Debes ingresar la ciudad.");
            return;
        }


        /* ===========================
           CALCULAR TOTAL
        =========================== */

        const totalCompra = carrito.reduce(
            (total, item) =>
                total + (item.precio * item.cantidad),
            0
        );


        console.log("Total de la compra:", totalCompra);


        try {

            /* ===========================
               1. CREAR PEDIDO
            =========================== */

            console.log("Creando pedido...");

            const respuestaPedido = await fetch(
                "http://localhost:5146/api/Pedidos",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        nombreCliente: nombreCliente,

                        telefono: telefono,

                        direccion: direccion,

                        ciudad: ciudad,

                        total: totalCompra

                    })
                }
            );


            console.log(
                "Respuesta pedido:",
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


            /* ===========================
               2. AGREGAR DETALLES
            =========================== */

            for (const item of carrito) {

                console.log(
                    "Agregando producto:",
                    item.id,
                    "Cantidad:",
                    item.cantidad
                );


                const respuestaDetalle =
                    await fetch(
                        `http://localhost:5146/api/Pedidos/${pedido.id}/detalles`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                productoId: item.id,

                                cantidad: item.cantidad

                            })
                        }
                    );


                console.log(
                    "Respuesta detalle:",
                    respuestaDetalle.status
                );


                if (!respuestaDetalle.ok) {

                    throw new Error(
                        "Error al agregar producto " +
                        item.id +
                        ". HTTP " +
                        respuestaDetalle.status
                    );

                }


                const detalle =
                    await respuestaDetalle.json();


                console.log(
                    "DETALLE CREADO:",
                    detalle
                );

            }


            /* ===========================
               3. COMPRA EXITOSA
            =========================== */

            alert(
                "Compra realizada correctamente.\n\n" +
                "Número de pedido: " +
                pedido.id +
                "\n" +
                "Total: $" +
                totalCompra.toLocaleString("es-CO")
            );


            /* ===========================
               4. VACIAR CARRITO
            =========================== */

            carrito = [];

            guardarCarrito();

            actualizarContadorCarrito();

            mostrarCarrito();


            console.log(
                "Carrito vaciado correctamente."
            );

        }
        catch (error) {

            console.error(
                "ERROR AL FINALIZAR COMPRA:",
                error
            );


            alert(
                "No fue posible finalizar la compra.\n\n" +
                "Revisa la consola para ver el error."
            );

        }

    });

});