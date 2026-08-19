namespace MulfordStore.API.Models
{
    public class Producto
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Categoria { get; set; } = string.Empty;

        public string Referencia { get; set; } = string.Empty;

        public string Tono { get; set; } = string.Empty;

        public int Stock { get; set; }

        public decimal Precio { get; set; }

        public string Imagen { get; set; } = string.Empty;
    }
}