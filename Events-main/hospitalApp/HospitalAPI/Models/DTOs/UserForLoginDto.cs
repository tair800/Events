using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models.DTOs
{
    public class UserForLoginDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}

