using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace MulfordStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PedidosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREAR PEDIDO
        // =========================================================

        [HttpPost]
        public async Task<IActionResult> CrearPedido([FromBody] Pedido pedido)
        {
            if (pedido == null)
            {
                return BadRequest(new
                {
                    mensaje = "Los datos del pedido son obligatorios."
                });
            }

            if (string.IsNullOrWhiteSpace(pedido.NombreCliente))
            {
                return BadRequest(new
                {
                    mensaje = "El nombre del cliente es obligatorio."
                });
            }

            if (string.IsNullOrWhiteSpace(pedido.Telefono))
            {
                return BadRequest(new
                {
                    mensaje = "El teléfono es obligatorio."
                });
            }

            if (string.IsNullOrWhiteSpace(pedido.Direccion))
            {
                return BadRequest(new
                {
                    mensaje = "La dirección es obligatoria."
                });
            }

            if (string.IsNullOrWhiteSpace(pedido.Ciudad))
            {
                return BadRequest(new
                {
                    mensaje = "La ciudad es obligatoria."
                });
            }

            if (string.IsNullOrWhiteSpace(pedido.MetodoPago))
            {
                return BadRequest(new
                {
                    mensaje = "El método de pago es obligatorio."
                });
            }

            var metodosPagoPermitidos = new[]
            {
                "nequi",
                "bre-b",
                "contraentrega"
            };

            if (!metodosPagoPermitidos.Contains(
                    pedido.MetodoPago.ToLower()))
            {
                return BadRequest(new
                {
                    mensaje = "El método de pago no es válido."
                });
            }

            // El servidor controla estos valores.
            pedido.Fecha = DateTime.Now;
            pedido.Estado = "Pendiente";
            pedido.Total = 0;

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(ObtenerPedido),
                new { id = pedido.Id },
                pedido
            );
        }


        // =========================================================
        // OBTENER PEDIDO POR ID
        // =========================================================
       
        [Authorize(Roles = "Administrador")]
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPedido(int id)
        {
            var pedido = await _context.Pedidos
                .FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }

            return Ok(pedido);
        }


        // =========================================================
        // OBTENER TODOS LOS PEDIDOS
        // =========================================================
        [Authorize(Roles = "Administrador")]
        [HttpGet]
        public async Task<IActionResult> ObtenerPedidos()
        {
            var pedidos = await _context.Pedidos
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();

            return Ok(pedidos);
        }


        // =========================================================
        // OBTENER DETALLES DE UN PEDIDO
        // =========================================================
        [Authorize(Roles = "Administrador")]
        [HttpGet("{id}/detalles")]
        public async Task<IActionResult> ObtenerDetalles(int id)
        {
            var pedido = await _context.Pedidos
                .FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }

            var detalles = await _context.DetallesPedidos
                .Where(d => d.PedidoId == id)
                .ToListAsync();

            return Ok(detalles);
        }


        // =========================================================
        // AGREGAR DETALLE AL PEDIDO
        // =========================================================

        [HttpPost("{id}/detalles")]
        public async Task<IActionResult> AgregarDetalle(
            int id,
            [FromBody] DetallePedido detalle)
        {
            if (detalle == null)
            {
                return BadRequest(new
                {
                    mensaje = "Los datos del producto son obligatorios."
                });
            }

            // -----------------------------------------------------
            // BUSCAR PEDIDO
            // -----------------------------------------------------

            var pedido = await _context.Pedidos
                .FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }


            // -----------------------------------------------------
            // VALIDAR ESTADO DEL PEDIDO
            // -----------------------------------------------------

            if (pedido.Estado == "Cancelado")
            {
                return BadRequest(new
                {
                    mensaje =
                        "No se pueden agregar productos a un pedido cancelado."
                });
            }

            if (pedido.Estado == "Entregado")
            {
                return BadRequest(new
                {
                    mensaje =
                        "No se pueden agregar productos a un pedido entregado."
                });
            }


            // -----------------------------------------------------
            // VALIDAR CANTIDAD
            // -----------------------------------------------------

            if (detalle.Cantidad <= 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "La cantidad debe ser mayor que cero."
                });
            }


            // -----------------------------------------------------
            // BUSCAR PRODUCTO
            // -----------------------------------------------------

            var producto = await _context.Productos
                .FindAsync(detalle.ProductoId);

            if (producto == null)
            {
                return NotFound(new
                {
                    mensaje = "El producto no existe."
                });
            }


            // -----------------------------------------------------
            // VALIDAR STOCK REAL
            // -----------------------------------------------------

            if (detalle.Cantidad > producto.Stock)
            {
                return BadRequest(new
                {
                    mensaje =
                        $"Solo quedan {producto.Stock} unidades disponibles."
                });
            }


            // -----------------------------------------------------
            // PREPARAR DETALLE
            // -----------------------------------------------------

            detalle.PedidoId = id;

            detalle.PrecioUnitario = producto.Precio;

            detalle.Subtotal =
                producto.Precio * detalle.Cantidad;


            // -----------------------------------------------------
            // DESCONTAR STOCK
            // -----------------------------------------------------

            producto.Stock -= detalle.Cantidad;


            // -----------------------------------------------------
            // AGREGAR DETALLE
            // -----------------------------------------------------

            _context.DetallesPedidos.Add(detalle);


            // -----------------------------------------------------
            // ACTUALIZAR TOTAL DEL PEDIDO
            // -----------------------------------------------------

            pedido.Total += detalle.Subtotal;


            // -----------------------------------------------------
            // GUARDAR TODO
            // -----------------------------------------------------

            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(ObtenerPedido),
                new { id = pedido.Id },
                detalle
            );
        }


        // =========================================================
        // CAMBIAR ESTADO DEL PEDIDO
        // =========================================================

        [Authorize(Roles = "Administrador")]
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(
                    int id,
                    [FromBody] string nuevoEstado)
        {
            var pedido = await _context.Pedidos
                .FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }


            // -----------------------------------------------------
            // ESTADOS PERMITIDOS
            // -----------------------------------------------------

            var estadosPermitidos = new[]
            {
                "Pendiente",
                "Confirmado",
                "Enviado",
                "Entregado",
                "Cancelado"
            };


            if (!estadosPermitidos.Contains(nuevoEstado))
            {
                return BadRequest(new
                {
                    mensaje =
                        "El estado indicado no es válido."
                });
            }


            // -----------------------------------------------------
            // NO MODIFICAR PEDIDO ENTREGADO
            // -----------------------------------------------------

            if (pedido.Estado == "Entregado")
            {
                return BadRequest(new
                {
                    mensaje =
                        "Un pedido entregado no puede cambiar de estado."
                });
            }


            // -----------------------------------------------------
            // CANCELAR PEDIDO
            // -----------------------------------------------------

            if (
                nuevoEstado == "Cancelado" &&
                pedido.Estado != "Cancelado"
            )
            {
                var detalles = await _context.DetallesPedidos
                    .Where(d => d.PedidoId == id)
                    .ToListAsync();


                foreach (var detalle in detalles)
                {
                    var producto = await _context.Productos
                        .FindAsync(detalle.ProductoId);


                    if (producto != null)
                    {
                        producto.Stock += detalle.Cantidad;
                    }
                }
            }


            // -----------------------------------------------------
            // ACTUALIZAR ESTADO
            // -----------------------------------------------------

            pedido.Estado = nuevoEstado;

            await _context.SaveChangesAsync();


            return Ok(new
            {
                mensaje =
                    "Estado actualizado correctamente.",

                pedido.Id,

                pedido.Estado
            });
        }
    }
}