using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _context.Productos.ToListAsync();

            return Ok(productos);
        }
    }
}