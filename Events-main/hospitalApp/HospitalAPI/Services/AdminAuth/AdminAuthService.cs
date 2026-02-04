using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Models.DTOs;

namespace HospitalAPI.Services.AdminAuth
{
    public class AdminAuthService : IAdminAuthService
    {
        private readonly HospitalDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminAuthService(HospitalDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Admin> RegisterAdmin(AdminForRegistrationDto adminForRegistration)
        {
            if (await AdminExists(adminForRegistration.Username))
            {
                throw new ArgumentException("Admin username already exists");
            }

            CreatePasswordHash(adminForRegistration.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var admin = new Admin
            {
                Username = adminForRegistration.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            await _context.Admins.AddAsync(admin);
            await _context.SaveChangesAsync();

            return admin;
        }

        public async Task<string> LoginAdmin(AdminForLoginDto adminForLogin)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == adminForLogin.Username);

            if (admin == null)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            if (!VerifyPasswordHash(adminForLogin.Password, admin.PasswordHash, admin.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            return CreateToken(admin);
        }

        public async Task<bool> AdminExists(string username)
        {
            return await _context.Admins.AnyAsync(a => a.Username == username);
        }

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
            }
            return true;
        }

        private string CreateToken(Admin admin)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                new Claim(ClaimTypes.Name, admin.Username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_configuration.GetSection("JwtSettings:SecretKey").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _configuration.GetSection("JwtSettings:Issuer").Value,
                Audience = _configuration.GetSection("JwtSettings:Audience").Value
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}

