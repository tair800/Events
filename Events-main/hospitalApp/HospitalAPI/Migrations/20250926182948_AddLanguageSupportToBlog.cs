using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageSupportToBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondDescBodyEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondDescBodyRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondDescTitleEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondDescTitleRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThirdTextBodyEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThirdTextBodyRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThirdTextTitleEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThirdTextTitleRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "Blogs",
                type: "TEXT",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "Blogs",
                type: "TEXT",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "SecondDescBodyEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "SecondDescBodyRu",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "SecondDescTitleEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "SecondDescTitleRu",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ThirdTextBodyEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ThirdTextBodyRu",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ThirdTextTitleEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ThirdTextTitleRu",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "Blogs");
        }
    }
}
