using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MulfordStore.API.Migrations
{
    public partial class AgregarAdministrador : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Administradores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),

                    Usuario = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: false),

                    PasswordHash = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: false),

                    Activo = table.Column<bool>(
                        type: "bit",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administradores", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administradores");
        }
    }
}