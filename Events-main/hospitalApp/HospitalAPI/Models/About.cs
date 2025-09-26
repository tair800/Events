using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class About
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Img { get; set; } = string.Empty;
        
        // English language fields
        [MaxLength(500)]
        public string? TitleEn { get; set; }
        
        public string? DescriptionEn { get; set; }
        
        // Russian language fields
        [MaxLength(500)]
        public string? TitleRu { get; set; }
        
        public string? DescriptionRu { get; set; }
    }
}
