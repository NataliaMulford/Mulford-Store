using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;

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

        // ==========================================
        // CREAR PEDIDO
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> CrearPedido(Pedido pedido)
        {
            pedido.Fecha = DateTime.Now;
            pedido.Estado = "Pendiente";

            // El total comienza en cero.
            // Se actualizará cuando se agreguen los detalles.
            pedido.Total = 0;

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(ObtenerPedido),
                new { id = pedido.Id },
                pedido
            );
        }


        // ==========================================
        // OBTENER PEDIDO POR ID
        // ==========================================

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }

            return Ok(pedido);
        }


        // ==========================================
        // OBTENER DETALLES DE UN PEDIDO
        // ==========================================

        [HttpGet("{id}/detalles")]
        public async Task<IActionResult> ObtenerDetalles(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

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


        // ==========================================
        // OBTENER TODOS LOS PEDIDOS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> ObtenerPedidos()
        {
            var pedidos = await _context.Pedidos
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();

            return Ok(pedidos);
        }


        // ==========================================
        // AGREGAR DETALLE AL PEDIDO
        // ==========================================

        [HttpPost("{id}/detalles")]
        public async Task<IActionResult> AgregarDetalle(
            int id,
            DetallePedido detalle)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound(new
                {
                    mensaje = "El pedido no existe."
                });
            }

            // No permitimos agregar productos a un pedido
            // que ya fue cancelado o entregado.

            if (pedido.Estado == "Cancelado")
            {
                return BadRequest(new
                {
                    mensaje = "No se pueden agregar productos a un pedido cancelado."
                });
            }

            if (pedido.Estado == "Entregado")
            {
                return BadRequest(new
                {
                    mensaje = "No se pueden agregar productos a un pedido entregado."
                });
            }

            var producto = await _context.Productos
                .FindAsync(detalle.ProductoId);

            if (producto == null)
            {
                return NotFound(new
                {
                    mensaje = "El producto no existe."
                });
            }

            if (detalle.Cantidad <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "La cantidad debe ser mayor que cero."
                });
            }

            // ==========================================
            // VALIDAR STOCK REAL
            // ==========================================

            if (detalle.Cantidad > producto.Stock)
            {
                return BadRequest(new
                {
                    mensaje = $"Solo quedan {producto.Stock} unidades disponibles."
                });
            }

            // ==========================================
            // CALCULAR DETALLE
            // ==========================================

            detalle.PedidoId = id;

            detalle.PrecioUnitario = producto.Precio;

            detalle.Subtotal =
                producto.Precio * detalle.Cantidad;

            // ==========================================
            // DESCONTAR INVENTARIO
            // ==========================================

            producto.Stock -= detalle.Cantidad;

            // ==========================================
            // GUARDAR DETALLE
            // ==========================================

            _context.DetallesPedidos.Add(detalle);

            // ==========================================
            // ACTUALIZAR TOTAL DEL PEDIDO
            // ==========================================

            pedido.Total += detalle.Subtotal;

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(ObtenerPedido),
                new { id = pedido.Id },
                detalle
            );
        }


        // ==========================================
        // CAMBIAR ESTADO DEL PEDIDO
        // ==========================================

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
                    mensaje = "El estado indicado no es válido."
                });
            }

            // ==========================================
            // EVITAR CAMBIOS DESPUÉS DE ENTREGADO
            // ==========================================

            if (pedido.Estado == "Entregado")
            {
                return BadRequest(new
                {
                    mensaje = "Un pedido entregado no puede cambiar de estado."
                });
            }

            // ==========================================
            // CANCELAR PEDIDO
            // ==========================================

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

            // ==========================================
            // ACTUALIZAR ESTADO
            // ==========================================

            pedido.Estado = nuevoEstado;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Estado actualizado correctamente.",
                pedido.Id,
                pedido.Estado
            });
        }
    }
}