using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;
using Microsoft.AspNetCore.Authorization;
using MulfordStore.API.DTOs;
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
        public async Task<IActionResult> CrearPedido(
            [FromBody] CrearPedidoDTO solicitud)
        {
            if (solicitud == null)
                return BadRequest(new { mensaje = "Los datos del pedido son obligatorios." });

            if (string.IsNullOrWhiteSpace(solicitud.NombreCliente) ||
                string.IsNullOrWhiteSpace(solicitud.Telefono) ||
                string.IsNullOrWhiteSpace(solicitud.Direccion) ||
                string.IsNullOrWhiteSpace(solicitud.Ciudad))
            {
                return BadRequest(new
                {
                    mensaje = "Debes completar todos los datos del cliente."
                });
            }
            if (string.IsNullOrWhiteSpace(solicitud.Cedula))
            {
                return BadRequest(new
                {
                    mensaje = "La cédula del cliente es obligatoria."
                });
            }

            string cedula = solicitud.Cedula.Trim();

            if (!System.Text.RegularExpressions.Regex.IsMatch(cedula, @"^\d{5,15}$"))
            {
                return BadRequest(new
                {
                    mensaje = "La cédula debe contener entre 5 y 15 dígitos."
                });
            }

            var metodosPagoPermitidos = new[]
            {
    "nequi",
    "bre-b",
    "bancolombia",
    "davivienda"
};


            var metodoPago = solicitud.MetodoPago?.Trim().ToLowerInvariant();

            if (metodoPago == null ||
                !metodosPagoPermitidos.Contains(metodoPago))
            {
                return BadRequest(new { mensaje = "El método de pago no es válido." });
            }

            if (solicitud.Productos == null || solicitud.Productos.Count == 0)
            {
                return BadRequest(new { mensaje = "El pedido debe incluir productos." });
            }

            if (solicitud.Productos.Any(p => p.ProductoId <= 0 || p.Cantidad <= 0))
            {
                return BadRequest(new
                {
                    mensaje = "Cada producto debe tener un identificador y una cantidad válidos."
                });
            }

            // Consolidar productos repetidos para validar el stock correctamente.
            var cantidades = solicitud.Productos
                .GroupBy(p => p.ProductoId)
                .ToDictionary(g => g.Key, g => g.Sum(p => p.Cantidad));

            await using var transaccion =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var ids = cantidades.Keys.ToList();

                var productos = await _context.Productos
                    .Where(p => ids.Contains(p.Id))
                    .ToListAsync();

                if (productos.Count != ids.Count)
                {
                    return BadRequest(new
                    {
                        mensaje = "Uno o más productos no existen."
                    });
                }

                foreach (var producto in productos)
                {
                    var cantidadSolicitada = cantidades[producto.Id];

                    if (producto.Stock < cantidadSolicitada)
                    {
                        return BadRequest(new
                        {
                            mensaje = $"Stock insuficiente para {producto.Nombre}. Disponibles: {producto.Stock}."
                        });
                    }
                }

                var pedido = new Pedido
                {
                    Cedula = cedula,
                    NombreCliente = solicitud.NombreCliente.Trim(),
                    Telefono = solicitud.Telefono.Trim(),
                    Direccion = solicitud.Direccion.Trim(),
                    Ciudad = solicitud.Ciudad.Trim(),
                    MetodoPago = metodoPago,
                    Estado = "Pendiente",
                    Fecha = DateTime.Now,
                    Total = 0
                };

                _context.Pedidos.Add(pedido);
                await _context.SaveChangesAsync();

                pedido.ReferenciaComercial = GenerarReferenciaComercial(pedido.Id);

                foreach (var producto in productos)
                {
                    var cantidad = cantidades[producto.Id];
                    var subtotal = producto.Precio * cantidad;

                    _context.DetallesPedidos.Add(new DetallePedido
                    {
                        PedidoId = pedido.Id,
                        ProductoId = producto.Id,
                        Cantidad = cantidad,
                        PrecioUnitario = producto.Precio,
                        Subtotal = subtotal
                    });

                    producto.Stock -= cantidad;
                    pedido.Total += subtotal;
                }

                await _context.SaveChangesAsync();
                await transaccion.CommitAsync();

                return Ok(new
                {
                    mensaje = "Pedido creado correctamente.",
                    pedido.Id,
                    pedido.ReferenciaComercial,
                    pedido.NombreCliente,
                    pedido.Estado,
                    pedido.Total,
                    pedido.MetodoPago
                });
            }
            catch
            {
                await transaccion.RollbackAsync();

                return StatusCode(500, new
                {
                    mensaje = "No fue posible procesar la compra. No se guardaron los cambios."
                });
            }
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
        [Authorize(Roles = "Administrador")]
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
            // VALIDAR TRANSICIONES DE ESTADO
            // -----------------------------------------------------

            bool transicionValida = pedido.Estado switch
            {
                "Pendiente" =>
                    nuevoEstado == "Confirmado" ||
                    nuevoEstado == "Cancelado",

                "Confirmado" =>
                    nuevoEstado == "Enviado" ||
                    nuevoEstado == "Cancelado",

                "Enviado" =>
                    nuevoEstado == "Entregado",

                "Entregado" => false,

                "Cancelado" => false,

                _ => false
            };


            if (!transicionValida)
            {
                return BadRequest(new
                {
                    mensaje = "La transición de estado no está permitida.",
                    estadoActual = pedido.Estado,
                    estadoSolicitado = nuevoEstado
                });
            }


            // -----------------------------------------------------
            // CANCELAR PEDIDO Y RESTAURAR INVENTARIO
            // -----------------------------------------------------

            if (nuevoEstado == "Cancelado")
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


        // =========================================================
        // CONFIRMAR PAGO DE UN PEDIDO
        // =========================================================

        [Authorize(Roles = "Administrador")]
        [HttpPut("{id}/confirmar-pago")]
        public async Task<IActionResult> ConfirmarPago(int id)
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

            if (pedido.Estado != "Pendiente")
            {
                return BadRequest(new
                {
                    mensaje = "Solo se pueden confirmar pagos de pedidos pendientes.",
                    estadoActual = pedido.Estado
                });
            }

            pedido.Estado = "Confirmado";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Pago confirmado correctamente.",
                pedido.Id,
                pedido.NombreCliente,
                pedido.Total,
                pedido.MetodoPago,
                pedido.Estado
            });
        }
        private static string GenerarReferenciaComercial(int id)
        {
            int bloque = ((id - 1) / 100) + 1;
            int consecutivo = ((id - 1) % 100) + 1;

            return $"{bloque * 10000 + consecutivo}";
        }

    }


}