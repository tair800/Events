using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageSupportToEventTimeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InfoEn",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InfoRu",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "EventTimeline",
                type: "TEXT",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "EventTimeline");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "EventTimeline");

            migrationBuilder.DropColumn(
                name: "InfoEn",
                table: "EventTimeline");

            migrationBuilder.DropColumn(
                name: "InfoRu",
                table: "EventTimeline");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "EventTimeline");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "EventTimeline");
        }
    }
}
