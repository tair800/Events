using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreLanguageFieldsToEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocationEn",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationRu",
                table: "Employees",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "first_desc_en",
                table: "Employees",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "first_desc_ru",
                table: "Employees",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "second_desc_en",
                table: "Employees",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "second_desc_ru",
                table: "Employees",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationEn",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "LocationRu",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "first_desc_en",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "first_desc_ru",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "second_desc_en",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "second_desc_ru",
                table: "Employees");
        }
    }
}
