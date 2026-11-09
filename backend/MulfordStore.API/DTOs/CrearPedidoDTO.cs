using System.Collections.Generic;

namespace MulfordStore.API.DTOs
{
    public class CrearPedidoDTO
    {
        public string Cedula { get; set; } = string.Empty;

        public string NombreCliente { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Direccion { get; set; } = string.Empty;

        public string Ciudad { get; set; } = string.Empty;

        public string MetodoPago { get; set; } = string.Empty;

        public List<ProductoPedidoDTO> Productos { get; set; } = new();
    }

    public class ProductoPedidoDTO
    {
        public int ProductoId { get; set; }

        public int Cantidad { get; set; }
    }
}