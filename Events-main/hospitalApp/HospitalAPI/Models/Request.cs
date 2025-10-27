using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Requests")]
    public class Request
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Surname { get; set; } = string.Empty;
        
        [Required]
        public string Gender { get; set; } = string.Empty; // Kişi, Qadın
        
        [Required]
        public string Role { get; set; } = string.Empty; // həkim-mütəxəssis, həkim, rezident, tələbə, tibb bacısı
        
        [Required]
        public string Specialty { get; set; } = string.Empty; // ümumi cərrah, gastroenteroloq, radioloq, onkoloq, patoloq, digər
        
        public string? SpecialtyOther { get; set; } // Only used when Specialty = "digər"
        
        [Required]
        public string Sector { get; set; } = string.Empty; // dövlət, özəl
        
        [Required]
        public string Institution { get; set; } = string.Empty; // Çalışdığınız qurum
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "pending"; // pending, completed
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // DTO for updating request status
    public class UpdateStatusRequest
    {
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = string.Empty;
    }
}
