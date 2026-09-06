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

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _context.Productos.ToListAsync();

            return Ok(productos);
        }

        // GET: api/Productos/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return Ok(producto);
        }

        // POST: api/Productos
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            // Validar que el stock no sea negativo
            if (producto.Stock < 0)
            {
                return BadRequest(new
                {
                    mensaje = "El stock no puede ser negativo."
                });
            }

            // Validar que el precio sea mayor que cero
            if (producto.Precio <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El precio debe ser mayor que cero."
                });
            }

            _context.Productos.Add(producto);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProducto),
                new { id = producto.Id },
                producto
            );
        }

        // PUT: api/Productos/1
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest(new
                {
                    mensaje = "El ID de la URL no coincide con el ID del producto."
                });
            }

            // Validar que el stock no sea negativo
            if (producto.Stock < 0)
            {
                return BadRequest(new
                {
                    mensaje = "El stock no puede ser negativo."
                });
            }

            // Validar que el precio sea mayor que cero
            if (producto.Precio <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El precio debe ser mayor que cero."
                });
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExiste(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/Productos/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExiste(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}