namespace HospitalAPI.Models.DTOs
{
    public class EventImageDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}

