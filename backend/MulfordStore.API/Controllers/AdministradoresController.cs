using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MulfordStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdministradoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AdministradoresController(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var administrador = await _context.Administradores
                .FirstOrDefaultAsync(a =>
                    a.Usuario == request.Usuario &&
                    a.Activo);

            if (administrador == null)
            {
                return Unauthorized(new
                {
                    mensaje = "Usuario o contraseña incorrectos."
                });
            }

            bool passwordCorrecta;

            if (!administrador.PasswordHash.StartsWith("PBKDF2$"))
            {
                passwordCorrecta =
                    administrador.PasswordHash == request.Password;

                if (passwordCorrecta)
                {
                    administrador.PasswordHash =
                        HashPassword(request.Password);

                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                passwordCorrecta = VerifyPassword(
                    request.Password,
                    administrador.PasswordHash);
            }

            if (!passwordCorrecta)
            {
                return Unauthorized(new
                {
                    mensaje = "Usuario o contraseña incorrectos."
                });
            }

            var token = GenerarToken(administrador);

            return Ok(new
            {
                mensaje = "Login correcto.",
                usuario = administrador.Usuario,
                token = token
            });
        }

        [HttpGet("protegido")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult Protegido()
        {
            return Ok(new
            {
                mensaje = "Acceso autorizado.",
                usuario = User.Identity?.Name
            });
        }

        private string GenerarToken(Administrador administrador)
        {
            var claims = new[]
            {
                new Claim(
                    ClaimTypes.Name,
                    administrador.Usuario),

                new Claim(
                    ClaimTypes.Role,
                    "Administrador")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(16);

            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                100_000,
                HashAlgorithmName.SHA256,
                32);

            return $"PBKDF2$100000${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
        }

        private static bool VerifyPassword(
            string password,
            string storedHash)
        {
            string[] parts = storedHash.Split('$');

            if (parts.Length != 4 || parts[0] != "PBKDF2")
                return false;

            if (!int.TryParse(parts[1], out int iterations))
                return false;

            byte[] salt = Convert.FromBase64String(parts[2]);
            byte[] expectedHash = Convert.FromBase64String(parts[3]);

            byte[] actualHash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                expectedHash.Length);

            return CryptographicOperations.FixedTimeEquals(
                actualHash,
                expectedHash);
        }
    }
}