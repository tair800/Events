using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models.DTOs
{
    public class AdminForRegistrationDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }
}

