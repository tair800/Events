using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHomeSectionLanguageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "section_1_description_en",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_1_description_ru",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_description_en",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_description_ru",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_purpose_description_en",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_purpose_description_ru",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_purpose_title_en",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_purpose_title_ru",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_title_en",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "section_4_title_ru",
                table: "HomeSections",
                type: "TEXT",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "section_1_description_en",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_1_description_ru",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_description_en",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_description_ru",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_purpose_description_en",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_purpose_description_ru",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_purpose_title_en",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_purpose_title_ru",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_title_en",
                table: "HomeSections");

            migrationBuilder.DropColumn(
                name: "section_4_title_ru",
                table: "HomeSections");
        }
    }
}
