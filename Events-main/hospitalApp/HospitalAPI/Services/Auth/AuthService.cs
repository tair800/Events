using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Models.DTOs;
using HospitalAPI.Services.Email;

namespace HospitalAPI.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly HospitalDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(HospitalDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<User> Register(UserForRegistrationDto userForRegistration)
        {
            if (await UserExists(userForRegistration.Username))
            {
                throw new ArgumentException("Username already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Email == userForRegistration.Email))
            {
                throw new ArgumentException("Email already exists");
            }

            CreatePasswordHash(userForRegistration.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == userForRegistration.Role);

            if (role == null)
            {
                // Create the role if it doesn't exist
                role = new Role { Name = userForRegistration.Role };
                await _context.Roles.AddAsync(role);
                await _context.SaveChangesAsync();
            }

            var user = new User
            {
                Username = userForRegistration.Username,
                Email = userForRegistration.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                RoleId = role.Id,
                FirstName = userForRegistration.FirstName?.Trim(),
                LastName = userForRegistration.LastName?.Trim(),
                Phone = userForRegistration.Phone?.Trim(),
                Position = userForRegistration.Position?.Trim(),
                FinCode = userForRegistration.FinCode?.Trim(),
                Location = userForRegistration.Location?.Trim(),
                Clinic = userForRegistration.Clinic?.Trim(),
                IsMember = false
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<string> Login(UserForLoginDto userForLogin)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == userForLogin.Username);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            if (!VerifyPasswordHash(userForLogin.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            return CreateToken(user);
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
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

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name)
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

        public async Task ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

            // Don't reveal if email exists or not for security
            if (user == null)
            {
                // Still return success to prevent email enumeration
                return;
            }

            // Generate reset token
            var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            user.PasswordResetToken = resetToken;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

            await _context.SaveChangesAsync();

            // Generate reset URL
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            var resetUrl = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(resetToken)}";

            // Send email
            await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken, resetUrl);
        }

        public async Task ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.PasswordResetToken == resetPasswordDto.Token &&
                u.PasswordResetTokenExpires > DateTime.UtcNow);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired reset token");
            }

            // Update password
            CreatePasswordHash(resetPasswordDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}

