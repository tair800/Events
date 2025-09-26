using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageSupportToEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClinicEn",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClinicRu",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FieldEn",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FieldRu",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullnameEn",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullnameRu",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClinicEn",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "ClinicRu",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "FieldEn",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "FieldRu",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "FullnameEn",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "FullnameRu",
                table: "Employees");
        }
    }
}
