using HospitalAPI.Models;
using HospitalAPI.Models.DTOs;

namespace HospitalAPI.Services.AdminAuth
{
    public interface IAdminAuthService
    {
        Task<Admin> RegisterAdmin(AdminForRegistrationDto adminForRegistration);
        Task<string> LoginAdmin(AdminForLoginDto adminForLogin);
        Task<bool> AdminExists(string username);
        void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
    }
}

