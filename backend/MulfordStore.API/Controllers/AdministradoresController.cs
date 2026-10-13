using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MulfordStore.API.Data;
using MulfordStore.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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


        // =========================================================
        // LOGIN DEL ADMINISTRADOR
        // POST: api/Administradores/login
        // =========================================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    mensaje = "Los datos de acceso son obligatorios."
                });
            }

            if (string.IsNullOrWhiteSpace(request.Usuario) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    mensaje =
                        "El usuario y la contraseña son obligatorios."
                });
            }


            // -----------------------------------------------------
            // BUSCAR ADMINISTRADOR
            // -----------------------------------------------------

            var administrador =
                await _context.Administradores
                    .FirstOrDefaultAsync(a =>
                        a.Usuario == request.Usuario &&
                        a.Activo);


            if (administrador == null)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "Usuario o contraseña incorrectos."
                });
            }


            // -----------------------------------------------------
            // VERIFICAR CONTRASEÑA
            // -----------------------------------------------------

            bool passwordCorrecta;


            // Contraseñas antiguas sin hash
            if (!administrador.PasswordHash
                    .StartsWith("PBKDF2$"))
            {
                passwordCorrecta =
                    administrador.PasswordHash ==
                    request.Password;


                // -------------------------------------------------
                // ACTUALIZAR A HASH
                // -------------------------------------------------

                if (passwordCorrecta)
                {
                    administrador.PasswordHash =
                        HashPassword(request.Password);

                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                passwordCorrecta =
                    VerifyPassword(
                        request.Password,
                        administrador.PasswordHash);
            }


            // -----------------------------------------------------
            // CONTRASEÑA INCORRECTA
            // -----------------------------------------------------

            if (!passwordCorrecta)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "Usuario o contraseña incorrectos."
                });
            }


            // -----------------------------------------------------
            // GENERAR TOKEN JWT
            // -----------------------------------------------------

            var token =
                GenerarToken(administrador);


            return Ok(new
            {
                mensaje = "Login correcto.",
                usuario = administrador.Usuario,
                token = token
            });
        }


        // =========================================================
        // RUTA PROTEGIDA
        // GET: api/Administradores/protegido
        // =========================================================

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


        // =========================================================
        // GENERAR TOKEN JWT
        // =========================================================

        private string GenerarToken(
            Administrador administrador)
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


            var jwtKey =
                _configuration["Jwt:Key"];


            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException(
                    "No se encontró Jwt:Key en la configuración.");
            }


            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey));


            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);


            var token =
                new JwtSecurityToken(
                    issuer:
                        _configuration["Jwt:Issuer"],

                    audience:
                        _configuration["Jwt:Audience"],

                    claims:
                        claims,

                    expires:
                        DateTime.UtcNow.AddHours(2),

                    signingCredentials:
                        credentials);


            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }


        // =========================================================
        // GENERAR HASH DE CONTRASEÑA
        // =========================================================

        private static string HashPassword(
            string password)
        {
            byte[] salt =
                RandomNumberGenerator.GetBytes(16);


            byte[] hash =
                Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    salt,
                    100_000,
                    HashAlgorithmName.SHA256,
                    32);


            return
                $"PBKDF2$100000$" +
                $"{Convert.ToBase64String(salt)}$" +
                $"{Convert.ToBase64String(hash)}";
        }


        // =========================================================
        // VERIFICAR CONTRASEÑA
        // =========================================================

        private static bool VerifyPassword(
            string password,
            string storedHash)
        {
            try
            {
                string[] parts =
                    storedHash.Split('$');


                if (
                    parts.Length != 4 ||
                    parts[0] != "PBKDF2")
                {
                    return false;
                }


                if (!int.TryParse(
                        parts[1],
                        out int iterations))
                {
                    return false;
                }


                byte[] salt =
                    Convert.FromBase64String(parts[2]);


                byte[] expectedHash =
                    Convert.FromBase64String(parts[3]);


                byte[] actualHash =
                    Rfc2898DeriveBytes.Pbkdf2(
                        password,
                        salt,
                        iterations,
                        HashAlgorithmName.SHA256,
                        expectedHash.Length);


                return
                    CryptographicOperations.FixedTimeEquals(
                        actualHash,
                        expectedHash);
            }
            catch
            {
                return false;
            }
        }
    }
}