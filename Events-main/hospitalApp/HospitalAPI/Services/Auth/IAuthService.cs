using HospitalAPI.Models;
using HospitalAPI.Models.DTOs;

namespace HospitalAPI.Services.Auth
{
    public interface IAuthService
    {
        Task<User> Register(UserForRegistrationDto userForRegistration);
        Task<string> Login(UserForLoginDto userForLogin);
        Task<bool> UserExists(string username);
        void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
    }
}

