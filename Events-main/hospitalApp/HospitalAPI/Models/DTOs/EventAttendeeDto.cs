namespace HospitalAPI.Models.DTOs
{
    public class EventAttendeeDto
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public bool IsMember { get; set; }
        public string Status { get; set; } = "registered";
        public string? CertificateFileName { get; set; }
    }
}

