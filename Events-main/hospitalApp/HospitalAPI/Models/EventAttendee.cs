using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("EventAttendees")]
    public class EventAttendee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EventId { get; set; }

        [Required]
        public int UserId { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? PaidPrice { get; set; }

    [MaxLength(3)]
    public string PaidCurrency { get; set; } = "AZN";

        [MaxLength(20)]
        public string Status { get; set; } = "registered";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

