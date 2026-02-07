using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models.DTOs
{
    public class UpdateUserProfileDto
    {
        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        [MaxLength(50)]
        [RegularExpression(@"^\+?\d{9,15}$", ErrorMessage = "Invalid phone number format.")]
        public string? Phone { get; set; }

        [MaxLength(150)]
        public string? Position { get; set; }

        [StringLength(7, MinimumLength = 7, ErrorMessage = "FIN code must be 7 characters.")]
        public string? FinCode { get; set; }

        [MaxLength(255)]
        public string? Location { get; set; }

        [MaxLength(255)]
        public string? Clinic { get; set; }

        public bool? IsMember { get; set; }
    }
}

