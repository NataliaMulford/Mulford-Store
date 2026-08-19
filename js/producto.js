const parametros = new URLSearchParams(window.location.search);

const id = parseInt(parametros.get("id"));

const contenedor = document.getElementById("detalle-producto");

async function cargarProducto() {

    try {

        const respuesta = await fetch("./data/productos.json");

        const productos = await respuesta.json();

        const producto = productos.find(p => p.id === id);

        if (!producto) {

            contenedor.innerHTML = `
                <h2>Producto no encontrado</h2>
            `;

            return;

        }

        contenedor.innerHTML = `

            <div class="producto-detalle">

                <div class="producto-imagen">

                    <img src="${producto.imagen}" alt="${producto.nombre}">

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

    Maquillaje original Trendy de excelente calidad, ideal para uso diario y profesional.

</div>

                  <div class="quantity-selector">

    <button id="menos-producto" class="qty-btn">
        −
    </button>

    <span id="cantidad-producto" class="qty-value">
        1
    </span>

    <button id="mas-producto" class="qty-btn">
        +
    </button>

</div>

<div class="producto-botones">

    <button
        id="agregar-producto"
        class="btn btn-primary">

        Agregar al carrito

    </button>

    <a href="catalogo.html" class="btn btn-secondary">

        Volver al catálogo

    </a>

</div>
                </div>

            </div>

        `;

    } catch (error) {

        console.error(error);

    }

}

cargarProducto();

let cantidad = 1;

document.addEventListener("click", (e) => {

    if (e.target.id === "mas-producto") {

        cantidad++;

        document.getElementById("cantidad-producto").textContent = cantidad;

    }

    if (e.target.id === "menos-producto") {

        if (cantidad > 1) {

            cantidad--;

            document.getElementById("cantidad-producto").textContent = cantidad;

        }

    }

    if (e.target.id === "agregar-producto") {

        const producto = listaProductos.find(p => p.id === id);

        if (!producto) return;

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

        alert("Producto agregado al carrito");

    }

});