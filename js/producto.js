const parametros = new URLSearchParams(window.location.search);

const id = parseInt(parametros.get("id"));

const contenedor = document.getElementById("detalle-producto");

let listaProductos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cantidad = 1;


// ========================================
// CARGAR PRODUCTO DESDE LA API
// ========================================

async function cargarProducto() {

    try {

        const respuesta = await fetch(
            `http://localhost:5146/api/Productos/${id}`
        );

        if (!respuesta.ok) {

            if (respuesta.status === 404) {

                contenedor.innerHTML = `
                    <h2>Producto no encontrado</h2>
                `;

                return;
            }

            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const producto = await respuesta.json();

        listaProductos = [producto];

        contenedor.innerHTML = `

            <div class="producto-detalle">

                <div class="producto-imagen">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>

                <div class="producto-info">

                    <h1>${producto.nombre}</h1>

                    <p class="producto-referencia">
                        Ref. ${producto.referencia}
                    </p>

                    <p class="producto-tono">
                        Tono: ${producto.tono}
                    </p>

                    <p class="producto-stock">
                        Disponibles: ${producto.stock}
                    </p>

                    <div class="producto-precio">
                        $${producto.precio.toLocaleString("es-CO")}
                    </div>

                    <div class="producto-descripcion">

                        Maquillaje original Trendy de excelente calidad,
                        ideal para uso diario y profesional.

                    </div>

                    <div class="quantity-selector">

                        <button
                            id="menos-producto"
                            class="qty-btn">
                            −
                        </button>

                        <span
                            id="cantidad-producto"
                            class="qty-value">
                            1
                        </span>

                        <button
                            id="mas-producto"
                            class="qty-btn">
                            +
                        </button>

                    </div>

                    <div class="producto-botones">

                        <button
                            id="agregar-producto"
                            class="btn btn-primary">

                            Agregar al carrito

                        </button>

                        <a
                            href="catalogo.html"
                            class="btn btn-secondary">

                            Volver al catálogo

                        </a>

                    </div>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Error al cargar el producto:",
            error
        );

        contenedor.innerHTML = `
            <h2>No se pudo cargar el producto</h2>
            <p>Verifica que la API esté encendida.</p>
        `;
    }
}


// ========================================
// GUARDAR CARRITO
// ========================================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// ========================================
// ACTUALIZAR CONTADOR DEL CARRITO
// ========================================

function actualizarContadorCarrito() {

    const contador =
        document.getElementById("contador-carrito");

    if (!contador) return;

    const totalProductos = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    contador.textContent = totalProductos;

}


// ========================================
// BOTONES DEL PRODUCTO
// ========================================

document.addEventListener("click", (e) => {

    // AUMENTAR CANTIDAD
    if (e.target.id === "mas-producto") {

        const producto = listaProductos.find(
            p => p.id === id
        );

        if (!producto) return;

        if (cantidad < producto.stock) {

            cantidad++;

            document.getElementById(
                "cantidad-producto"
            ).textContent = cantidad;

        }

    }


    // DISMINUIR CANTIDAD
    if (e.target.id === "menos-producto") {

        if (cantidad > 1) {

            cantidad--;

            document.getElementById(
                "cantidad-producto"
            ).textContent = cantidad;

        }

    }


    // AGREGAR AL CARRITO
    if (e.target.id === "agregar-producto") {

        const producto = listaProductos.find(
            p => p.id === id
        );

        if (!producto) return;


        // VALIDAR STOCK
        if (cantidad > producto.stock) {

            alert(
                `Solo quedan ${producto.stock} unidades disponibles.`
            );

            return;
        }


        // BUSCAR SI YA EXISTE EN EL CARRITO
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


        // ACTUALIZAR STOCK VISUAL
        producto.stock -= cantidad;


        // GUARDAR
        guardarCarrito();


        // ACTUALIZAR CONTADOR
        actualizarContadorCarrito();


        // MENSAJE
        alert("Producto agregado al carrito");

    }

});


// ========================================
// INICIAR
// ========================================

cargarProducto();

actualizarContadorCarrito();