using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models.DTOs
{
    public class ScientificMaterialDto
    {
        [Required]
        [MaxLength(500)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Link { get; set; } = string.Empty;
    }
}

