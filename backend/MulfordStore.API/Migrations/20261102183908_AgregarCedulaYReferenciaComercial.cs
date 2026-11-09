
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MulfordStore.API.Migrations
{
    public partial class AgregarCedulaYReferenciaComercial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Agregar cédula: los pedidos antiguos pueden quedar sin ella.
            migrationBuilder.AddColumn<string>(
                name: "Cedula",
                table: "Pedidos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            // Crear temporalmente la referencia como nullable.
            migrationBuilder.AddColumn<string>(
                name: "ReferenciaComercial",
                table: "Pedidos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            // Asignar una referencia única a cada pedido existente.
            migrationBuilder.Sql(@"
                UPDATE Pedidos
                SET ReferenciaComercial =
                    CAST(
                        (((Id - 1) / 100 + 1) * 10000)
                        + ((Id - 1) % 100 + 1)
                    AS NVARCHAR(20));
            ");

            // Hacer obligatoria la referencia después de asignarla.
            migrationBuilder.AlterColumn<string>(
                name: "ReferenciaComercial",
                table: "Pedidos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            // Garantizar que no existan referencias duplicadas.
            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_ReferenciaComercial",
                table: "Pedidos",
                column: "ReferenciaComercial",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pedidos_ReferenciaComercial",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "Cedula",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "ReferenciaComercial",
                table: "Pedidos");
        }
    }
}
