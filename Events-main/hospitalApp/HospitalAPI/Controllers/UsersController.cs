using System.Security.Claims;
using HospitalAPI.Data;
using HospitalAPI.Models.DTOs;
using HospitalAPI.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly HospitalDbContext _context;
        private readonly IAuthService _authService;

        public UsersController(HospitalDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Position = user.Position,
                FinCode = user.FinCode,
                IsMember = user.IsMember
            });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserProfileDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Phone = u.Phone,
                    Position = u.Position,
                    FinCode = u.FinCode,
                    IsMember = u.IsMember
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("me")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateUserProfileDto update)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (update.FirstName != null)
            {
                user.FirstName = update.FirstName;
            }
            if (update.LastName != null)
            {
                user.LastName = update.LastName;
            }
            if (update.Phone != null)
            {
                user.Phone = update.Phone;
            }
            if (update.Position != null)
            {
                user.Position = update.Position;
            }
            if (update.FinCode != null)
            {
                user.FinCode = update.FinCode;
            }
            if (update.IsMember.HasValue)
            {
                user.IsMember = update.IsMember.Value;
            }
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Position = user.Position,
                FinCode = user.FinCode,
                IsMember = user.IsMember
            });
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!_authService.VerifyPasswordHash(changePasswordDto.CurrentPassword, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            _authService.CreatePasswordHash(changePasswordDto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

