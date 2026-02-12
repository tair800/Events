namespace HospitalAPI.Services.Email
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string resetToken, string resetUrl);
    }
}

