namespace HospitalAPI.Models.DTOs
{
    public class UserEventDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string? Venue { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public string Currency { get; set; } = "AZN";
        public decimal? PaidPrice { get; set; }
        public string? PaidCurrency { get; set; }
        public string Status { get; set; } = "registered";
        public string? CertificateFileName { get; set; }
    }
}

