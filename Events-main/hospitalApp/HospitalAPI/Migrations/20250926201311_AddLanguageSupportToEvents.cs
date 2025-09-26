using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageSupportToEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Events",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "Events",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LongDescriptionEn",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LongDescriptionRu",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegionEn",
                table: "Events",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegionRu",
                table: "Events",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubtitleEn",
                table: "Events",
                type: "TEXT",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubtitleRu",
                table: "Events",
                type: "TEXT",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "Events",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "Events",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrainerEn",
                table: "Events",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrainerRu",
                table: "Events",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VenueEn",
                table: "Events",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VenueRu",
                table: "Events",
                type: "TEXT",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LongDescriptionEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LongDescriptionRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "RegionEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "RegionRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "SubtitleEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "SubtitleRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TrainerEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TrainerRu",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VenueEn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VenueRu",
                table: "Events");
        }
    }
}
