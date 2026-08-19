let listaProductos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cantidades = {};

async function cargarProductos() {

    try {

        const respuesta = await fetch("./data/productos.json");

        listaProductos = await respuesta.json();

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

        console.error("Error al cargar los productos:", error);

    }

}

function mostrarProductos(productos) {

    const contenedor = document.getElementById("contenedor-productos");

    contenedor.innerHTML = "";

    productos.forEach(producto => {

        if (!cantidades[producto.id]) {
            cantidades[producto.id] = 1;
        }

        contenedor.innerHTML += `


<article class="product-card">

    <a href="producto.html?id=${producto.id}" class="product-link">

        <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
            loading="lazy">

        <h3>${producto.nombre}</h3>

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
            class="qty-btn"
            data-action="menos"
            data-id="${producto.id}">
            −
        </button>

        <span
            class="qty-value"
            data-id="${producto.id}">
            ${cantidades[producto.id]}
        </span>

        <button
            class="qty-btn"
            data-action="mas"
            data-id="${producto.id}">
            +
        </button>

    </div>

    <p class="price">
        $${producto.precio.toLocaleString("es-CO")}
    </p>

    <button
        class="btn btn-primary btn-comprar"
        data-id="${producto.id}">
        Agregar al carrito
    </button>

</article>
        `;

    });

    activarSelectorCantidad();
    activarBotonesComprar();

}
function activarBotonesComprar() {

    const botones = document.querySelectorAll(".btn-comprar");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const producto = listaProductos.find(p => p.id === id);

            if (!producto) return;

            const cantidad = cantidades[id] || 1;

            if (cantidad > producto.stock) {

                alert(`Solo quedan ${producto.stock} unidades disponibles.`);
                return;

            }

            const existe = carrito.find(item => item.id === id);

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

function actualizarContadorCarrito() {

    const contador = document.getElementById("contador-carrito");

    if (!contador) return;

    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

    contador.textContent = totalProductos;

}

function activarSelectorCantidad() {

    const botones = document.querySelectorAll(".qty-btn");

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            if (!cantidades[id]) {
                cantidades[id] = 1;
            }

            const producto = listaProductos.find(p => p.id === id);

            if (!producto) return;

            if (boton.dataset.action === "mas") {

                if (cantidades[id] < producto.stock) {
                    cantidades[id]++;
                }

            } else {

                if (cantidades[id] > 1) {
                    cantidades[id]--;
                }

            }

            const valor = document.querySelector(`.qty-value[data-id="${id}"]`);

            if (valor) {
                valor.textContent = cantidades[id];
            }

        });

    });

}
function activarCarrito() {

    const botonCarrito = document.querySelector(".carrito-btn");
    const panel = document.getElementById("carrito-panel");
    const cerrar = document.getElementById("cerrar-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");

    botonCarrito.addEventListener("click", () => {
        panel.classList.add("activo");
    });

    cerrar.addEventListener("click", () => {
        panel.classList.remove("activo");
    });

    botonVaciar.addEventListener("click", () => {

        carrito.forEach(item => {

            const producto = listaProductos.find(p => p.id === item.id);

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

function mostrarCarrito() {

    const lista = document.getElementById("lista-carrito");
    const total = document.getElementById("total-carrito");

    lista.innerHTML = "";

    let totalCompra = 0;

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        totalCompra += subtotal;

        lista.innerHTML += `
            <div class="item-carrito">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div>

                    <h4>${producto.nombre}</h4>

                    <div class="cantidad-carrito">

                        <button
                            class="btn-restar"
                            data-id="${producto.id}">
                            −
                        </button>

                        <span>${producto.cantidad}</span>

                        <button
                            class="btn-sumar"
                            data-id="${producto.id}">
                            +
                        </button>

                    </div>

                    <p>$${subtotal.toLocaleString("es-CO")}</p>

                    <button
                        class="btn-eliminar"
                        data-id="${producto.id}">
                        🗑 Eliminar
                    </button>

                </div>

            </div>
        `;

    });

    total.textContent = "$" + totalCompra.toLocaleString("es-CO");

    activarBotonesCarrito();

}
function activarBotonesCarrito() {

    const botonesSumar = document.querySelectorAll(".btn-sumar");
    const botonesRestar = document.querySelectorAll(".btn-restar");
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesSumar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(p => p.id === id);
            const producto = listaProductos.find(p => p.id === id);

            if (!item || !producto) return;

            if (producto.stock > 0) {

                item.cantidad++;
                producto.stock--;

                guardarCarrito();
                mostrarProductos(listaProductos);
                actualizarContadorCarrito();
                mostrarCarrito();

            } else {

                alert("No hay más unidades disponibles.");

            }

        });

    });

    botonesRestar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(p => p.id === id);
            const producto = listaProductos.find(p => p.id === id);

            if (!item || !producto) return;

            item.cantidad--;
            producto.stock++;

            if (item.cantidad <= 0) {
                carrito = carrito.filter(p => p.id !== id);
            }

            guardarCarrito();
            mostrarProductos(listaProductos);
            actualizarContadorCarrito();
            mostrarCarrito();

        });

    });

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", () => {

            const id = Number(boton.dataset.id);

            const item = carrito.find(p => p.id === id);
            const producto = listaProductos.find(p => p.id === id);

            if (!item || !producto) return;

            producto.stock += item.cantidad;

            carrito = carrito.filter(p => p.id !== id);

            guardarCarrito();
            mostrarProductos(listaProductos);
            actualizarContadorCarrito();
            mostrarCarrito();

        });

    });

}

function guardarCarrito() {

    localStorage.setItem("carrito", JSON.stringify(carrito));

}
function activarBuscador() {

    const buscador = document.getElementById("buscador");

    if (!buscador) return;

    buscador.addEventListener("input", () => {

        const texto = buscador.value.toLowerCase();

        const resultado = listaProductos.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.referencia.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );

        mostrarProductos(resultado);

    });

}
function activarFiltros() {

    const botones = document.querySelectorAll(".filter-btn");

    if (!botones.length) return;

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            botones.forEach(btn => btn.classList.remove("active"));

            boton.classList.add("active");

            const categoria = boton.dataset.category;

            if (categoria === "Todos") {

                mostrarProductos(listaProductos);
                return;

            }

            const filtrados = listaProductos.filter(producto =>
                producto.categoria === categoria
            );

            mostrarProductos(filtrados);

        });

    });

}

function aplicarCategoriaDesdeURL() {

    const parametros = new URLSearchParams(window.location.search);

    const categoria = parametros.get("categoria");

    console.log(categoria);

    if (!categoria) return;

    const botonActivo = document.querySelector(
        `.filter-btn[data-category="${categoria}"]`
    );

    if (botonActivo) {

        document
            .querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        botonActivo.classList.add("active");

        const productosFiltrados = listaProductos.filter(producto =>
            producto.categoria === categoria
        );

        mostrarProductos(productosFiltrados);

    }

}

cargarProductos();

activarCarrito();