using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRequestTableSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinCode",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Vezife",
                table: "Requests");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Institution",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Sector",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Specialty",
                table: "Requests",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpecialtyOther",
                table: "Requests",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Institution",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Sector",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Specialty",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "SpecialtyOther",
                table: "Requests");

            migrationBuilder.AddColumn<string>(
                name: "FinCode",
                table: "Requests",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Vezife",
                table: "Requests",
                type: "TEXT",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
