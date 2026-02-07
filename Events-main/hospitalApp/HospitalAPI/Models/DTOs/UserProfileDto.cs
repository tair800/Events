namespace HospitalAPI.Models.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Position { get; set; }
        public string? FinCode { get; set; }
        public string? AvatarPath { get; set; }
        public string? Location { get; set; }
        public string? Clinic { get; set; }
        public bool IsMember { get; set; }
    }
}

