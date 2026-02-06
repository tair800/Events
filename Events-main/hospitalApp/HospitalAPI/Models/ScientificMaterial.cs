using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("ScientificMaterials")]
    public class ScientificMaterial
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Link { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

