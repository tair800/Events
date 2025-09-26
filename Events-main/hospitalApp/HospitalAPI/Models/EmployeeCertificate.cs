using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Employee_certificates")]
    public class EmployeeCertificate
    {
        public int Id { get; set; }
        
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        
        [Required]
        [MaxLength(500)]
        [Column("certificate_image")]
        public string CertificateImage { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        [Column("certificate_name")]
        public string CertificateName { get; set; } = string.Empty;
        
        // English language field
        [MaxLength(255)]
        [Column("certificate_name_en")]
        public string? CertificateNameEn { get; set; }
        
        // Russian language field
        [MaxLength(255)]
        [Column("certificate_name_ru")]
        public string? CertificateNameRu { get; set; }
    }
}
