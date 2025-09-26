using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Blogs")]
    public class Blog
    {
        [Key]
        public int Id { get; set; }
        
        [MaxLength(10)]
        public string Number { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Date { get; set; } = string.Empty;
        
        public int Visitors { get; set; } = 0;
        
        [MaxLength(200)]
        public string? SecondDescTitle { get; set; }
        
        [MaxLength(1000)]
        public string? SecondDescBody { get; set; }
        
        [MaxLength(200)]
        public string? ThirdTextTitle { get; set; }
        
        [MaxLength(1000)]
        public string? ThirdTextBody { get; set; }
        
        [MaxLength(500)]
        public string? Image { get; set; }
        
        // English language fields
        [MaxLength(300)]
        public string? TitleEn { get; set; }
        
        [MaxLength(500)]
        public string? DescriptionEn { get; set; }
        
        [MaxLength(200)]
        public string? SecondDescTitleEn { get; set; }
        
        [MaxLength(1000)]
        public string? SecondDescBodyEn { get; set; }
        
        [MaxLength(200)]
        public string? ThirdTextTitleEn { get; set; }
        
        [MaxLength(1000)]
        public string? ThirdTextBodyEn { get; set; }
        
        // Russian language fields
        [MaxLength(300)]
        public string? TitleRu { get; set; }
        
        [MaxLength(500)]
        public string? DescriptionRu { get; set; }
        
        [MaxLength(200)]
        public string? SecondDescTitleRu { get; set; }
        
        [MaxLength(1000)]
        public string? SecondDescBodyRu { get; set; }
        
        [MaxLength(200)]
        public string? ThirdTextTitleRu { get; set; }
        
        [MaxLength(1000)]
        public string? ThirdTextBodyRu { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
