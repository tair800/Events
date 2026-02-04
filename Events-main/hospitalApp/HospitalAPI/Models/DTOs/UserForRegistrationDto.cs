using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HospitalAPI.Models.DTOs
{
    public class UserForRegistrationDto
    {
        [Required]
        [JsonPropertyName("username")]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [Required]
        [JsonPropertyName("role")]
        public string Role { get; set; } = "User"; // Default role

        [Required]
        [MaxLength(100)]
        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [Required]
        [MaxLength(50)]
        [RegularExpression(@"^\+?\d{9,15}$", ErrorMessage = "Invalid phone number format.")]
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(150)]
        [JsonPropertyName("position")]
        public string? Position { get; set; }

        [Required]
        [StringLength(7, MinimumLength = 7, ErrorMessage = "FIN code must be 7 characters.")]
        [JsonPropertyName("finCode")]
        public string? FinCode { get; set; }
    }
}

