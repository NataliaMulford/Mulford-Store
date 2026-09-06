namespace MulfordStore.API.Models
{
    public class Administrador
    {
        public int Id { get; set; }

        public string Usuario { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;
    }
}