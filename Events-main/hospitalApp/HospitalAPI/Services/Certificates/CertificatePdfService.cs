using HospitalAPI.Models;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace HospitalAPI.Services.Certificates
{
    public class CertificatePdfService
    {
        private readonly IWebHostEnvironment _environment;

        public CertificatePdfService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public string GenerateCertificatePdfFile(User user, Event eventItem, string uploadsDirectory)
        {
            var fileName = $"certificate_{eventItem.Id}_{user.Id}_{Guid.NewGuid()}.pdf";
            var filePath = Path.Combine(uploadsDirectory, fileName);
            var displayName = BuildDisplayName(user);
            var certId = $"{eventItem.Id}-{user.Id}";
            var pdfBytes = BuildCertificatePdfBytes(displayName, eventItem.Title, eventItem.EventDate, certId);
            File.WriteAllBytes(filePath, pdfBytes);
            return fileName;
        }

        public byte[] GeneratePreviewPdfBytes(Event eventItem)
        {
            var displayName = "Ad Soyad";
            var certId = $"{eventItem.Id}-PREVIEW";
            return BuildCertificatePdfBytes(displayName, eventItem.Title, eventItem.EventDate, certId);
        }

        private string BuildDisplayName(User user)
        {
            var displayName = $"{user.FirstName} {user.LastName}".Trim();
            if (string.IsNullOrWhiteSpace(displayName))
            {
                displayName = user.Username ?? "Participant";
            }
            return displayName;
        }

        private byte[] BuildCertificatePdfBytes(string participantName, string eventTitle, DateTime eventDate, string certificateId)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            var logoBytes = LoadLogoBytes();

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.PageColor("#F8FAFF");
                    page.DefaultTextStyle(x => x.FontSize(12).FontColor("#0F172A"));

                    page.Content()
                        .Border(2)
                        .BorderColor("#1E3A8A")
                        .Background("#FFFFFF")
                        .Padding(30)
                        .Column(column =>
                        {
                            column.Spacing(12);

                            if (logoBytes != null)
                            {
                                column.Item().AlignCenter().Width(160).Image(logoBytes).FitWidth();
                            }
                            else
                            {
                                column.Item().AlignCenter().Text("Hospital Association").FontSize(14).SemiBold();
                            }

                            column.Item().AlignCenter().Text("Certificate of Participation")
                                .FontSize(24)
                                .SemiBold()
                                .FontColor("#1E3A8A");

                            column.Item().AlignCenter().Text("This is to certify that");
                            column.Item().AlignCenter().Text(participantName)
                                .FontSize(20)
                                .Bold()
                                .FontColor("#0F172A");
                            column.Item().AlignCenter().Text("has participated in");
                            column.Item().AlignCenter().Text(eventTitle)
                                .FontSize(14)
                                .SemiBold()
                                .FontColor("#111827");
                            column.Item().AlignCenter().Text($"Date: {eventDate:dd MMM yyyy}")
                                .FontColor("#475569");

                            column.Item().PaddingTop(10).AlignCenter()
                                .Text($"Certificate ID: {certificateId}")
                                .FontSize(10)
                                .FontColor("#64748B");

                            column.Item().PaddingTop(10).LineHorizontal(1).LineColor("#E2E8F0");
                            column.Item().AlignCenter()
                                .Text("Azerbaijan HPB Surgeons Public Association")
                                .FontSize(10)
                                .FontColor("#64748B");
                        });
                });
            }).GeneratePdf();
        }

        private byte[]? LoadLogoBytes()
        {
            var logoPath = Path.GetFullPath(Path.Combine(
                _environment.ContentRootPath,
                "..",
                "hospital",
                "public",
                "assets",
                "logo-header.png"));

            return File.Exists(logoPath) ? File.ReadAllBytes(logoPath) : null;
        }
    }
}

