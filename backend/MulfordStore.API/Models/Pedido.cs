namespace MulfordStore.API.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public string NombreCliente { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Direccion { get; set; } = string.Empty;

        public string Ciudad { get; set; } = string.Empty;

        public decimal Total { get; set; }

        public string Estado { get; set; } = "Pendiente";

        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}