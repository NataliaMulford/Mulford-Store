using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace MulfordStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // OBTENER TODOS LOS PRODUCTOS
        // GET: api/Productos
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _context.Productos
                .ToListAsync();

            return Ok(productos);
        }


        // =========================================================
        // OBTENER PRODUCTO POR ID
        // GET: api/Productos/1
        // =========================================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .FindAsync(id);

            if (producto == null)
            {
                return NotFound(new
                {
                    mensaje = "El producto no existe."
                });
            }

            return Ok(producto);
        }


        // =========================================================
        // CREAR PRODUCTO
        // POST: api/Productos
        // SOLO ADMINISTRADOR
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Producto>> PostProducto(
            Producto producto)
        {
            // -----------------------------------------------------
            // VALIDAR STOCK
            // -----------------------------------------------------

            if (producto.Stock < 0)
            {
                return BadRequest(new
                {
                    mensaje = "El stock no puede ser negativo."
                });
            }


            // -----------------------------------------------------
            // VALIDAR PRECIO
            // -----------------------------------------------------

            if (producto.Precio <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El precio debe ser mayor que cero."
                });
            }


            // -----------------------------------------------------
            // GUARDAR PRODUCTO
            // -----------------------------------------------------

            _context.Productos.Add(producto);

            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(GetProducto),
                new { id = producto.Id },
                producto
            );
        }


        // =========================================================
        // ACTUALIZAR PRODUCTO
        // PUT: api/Productos/1
        // SOLO ADMINISTRADOR
        // =========================================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutProducto(
            int id,
            Producto producto)
        {
            // -----------------------------------------------------
            // VALIDAR ID
            // -----------------------------------------------------

            if (id != producto.Id)
            {
                return BadRequest(new
                {
                    mensaje =
                        "El ID de la URL no coincide con el ID del producto."
                });
            }


            // -----------------------------------------------------
            // VALIDAR STOCK
            // -----------------------------------------------------

            if (producto.Stock < 0)
            {
                return BadRequest(new
                {
                    mensaje = "El stock no puede ser negativo."
                });
            }


            // -----------------------------------------------------
            // VALIDAR PRECIO
            // -----------------------------------------------------

            if (producto.Precio <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El precio debe ser mayor que cero."
                });
            }


            // -----------------------------------------------------
            // ACTUALIZAR PRODUCTO
            // -----------------------------------------------------

            _context.Entry(producto).State =
                EntityState.Modified;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExiste(id))
                {
                    return NotFound(new
                    {
                        mensaje = "El producto no existe."
                    });
                }

                throw;
            }


            return NoContent();
        }


        // =========================================================
        // ELIMINAR PRODUCTO
        // DELETE: api/Productos/1
        // SOLO ADMINISTRADOR
        // =========================================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos
                .FindAsync(id);

            if (producto == null)
            {
                return NotFound(new
                {
                    mensaje = "El producto no existe."
                });
            }


            _context.Productos.Remove(producto);

            await _context.SaveChangesAsync();


            return NoContent();
        }


        // =========================================================
        // VERIFICAR SI EXISTE PRODUCTO
        // =========================================================

        private bool ProductoExiste(int id)
        {
            return _context.Productos
                .Any(e => e.Id == id);
        }
    }
}