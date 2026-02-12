using System.Net;
using System.Net.Mail;
using System.Text;

namespace HospitalAPI.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken, string resetUrl)
        {
            try
            {
                // Get email settings from configuration (using fake credentials for now)
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["EmailSettings:SmtpUsername"] ?? "fake-email@gmail.com";
                var smtpPassword = _configuration["EmailSettings:SmtpPassword"] ?? "fake-password";
                var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "fake-email@gmail.com";
                var fromName = _configuration["EmailSettings:FromName"] ?? "Hospital App";

                var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = "Şifrə Sıfırlama",
                    Body = GenerateEmailBody(resetUrl),
                    IsBodyHtml = true,
                    BodyEncoding = Encoding.UTF8,
                    SubjectEncoding = Encoding.UTF8
                };

                message.To.Add(email);

                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    await client.SendMailAsync(message);
                    _logger.LogInformation($"Password reset email sent to {email}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send password reset email to {email}");
                // Don't throw - we don't want to expose email errors to users
                // In production, you might want to queue this for retry
            }
        }

        private string GenerateEmailBody(string resetUrl)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #1B1B3F; color: white; padding: 20px; text-align: center; }}
        .content {{ background: #f9f9f9; padding: 30px; }}
        .button {{ display: inline-block; background: #1B1B3F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Şifrə Sıfırlama</h1>
        </div>
        <div class='content'>
            <p>Salam,</p>
            <p>Şifrənizi sıfırlamaq üçün aşağıdakı düyməyə klikləyin:</p>
            <p style='text-align: center;'>
                <a href='{resetUrl}' class='button'>Şifrəni Sıfırla</a>
            </p>
            <p>Əgər bu sorğunu siz göndərməmisinizsə, bu e-poçtu görməməzlikdən gəlin.</p>
            <p>Bu link 1 saat müddətində etibarlıdır.</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.Now.Year} Hospital App. Bütün hüquqlar qorunur.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}

