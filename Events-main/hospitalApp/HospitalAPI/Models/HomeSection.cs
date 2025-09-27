using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    public class HomeSection
    {
        public int Id { get; set; }
        
        [Column("section_1_description")]
        [MaxLength(2000)]
        public string? Section1Description { get; set; }
        
        [Column("section_1_description_en")]
        [MaxLength(2000)]
        public string? Section1DescriptionEn { get; set; }
        
        [Column("section_1_description_ru")]
        [MaxLength(2000)]
        public string? Section1DescriptionRu { get; set; }
        
        [Column("section_2_image")]
        [MaxLength(500)]
        public string? Section2Image { get; set; }
        
        [Column("section_3_image")]
        [MaxLength(500)]
        public string? Section3Image { get; set; }
        
        [Column("section_4_title")]
        [MaxLength(500)]
        public string? Section4Title { get; set; }
        
        [Column("section_4_title_en")]
        [MaxLength(500)]
        public string? Section4TitleEn { get; set; }
        
        [Column("section_4_title_ru")]
        [MaxLength(500)]
        public string? Section4TitleRu { get; set; }
        
        [Column("section_4_description")]
        [MaxLength(2000)]
        public string? Section4Description { get; set; }
        
        [Column("section_4_description_en")]
        [MaxLength(2000)]
        public string? Section4DescriptionEn { get; set; }
        
        [Column("section_4_description_ru")]
        [MaxLength(2000)]
        public string? Section4DescriptionRu { get; set; }
        
        [Column("section_4_purpose_title")]
        [MaxLength(500)]
        public string? Section4PurposeTitle { get; set; }
        
        [Column("section_4_purpose_title_en")]
        [MaxLength(500)]
        public string? Section4PurposeTitleEn { get; set; }
        
        [Column("section_4_purpose_title_ru")]
        [MaxLength(500)]
        public string? Section4PurposeTitleRu { get; set; }
        
        [Column("section_4_purpose_description")]
        [MaxLength(2000)]
        public string? Section4PurposeDescription { get; set; }
        
        [Column("section_4_purpose_description_en")]
        [MaxLength(2000)]
        public string? Section4PurposeDescriptionEn { get; set; }
        
        [Column("section_4_purpose_description_ru")]
        [MaxLength(2000)]
        public string? Section4PurposeDescriptionRu { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
