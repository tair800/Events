using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageSupportToEventSpeaker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "EventSpeakers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameRu",
                table: "EventSpeakers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "EventSpeakers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "EventSpeakers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "EventSpeakers");

            migrationBuilder.DropColumn(
                name: "NameRu",
                table: "EventSpeakers");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "EventSpeakers");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "EventSpeakers");
        }
    }
}
