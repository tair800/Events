using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}

