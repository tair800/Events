using HospitalAPI.Data;
using HospitalAPI.Models.DTOs;
using HospitalAPI.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IO;

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
                AvatarPath = user.AvatarPath,
                Location = user.Location,
                Clinic = user.Clinic,
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
                    AvatarPath = u.AvatarPath,
                    Location = u.Location,
                    Clinic = u.Clinic,
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
            if (update.Location != null)
            {
                user.Location = update.Location;
            }
            if (update.Clinic != null)
            {
                user.Clinic = update.Clinic;
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
                AvatarPath = user.AvatarPath,
                Location = user.Location,
                Clinic = user.Clinic,
                IsMember = user.IsMember
            });
        }

        [HttpPut("me/avatar")]
        public async Task<ActionResult<UserProfileDto>> UpdateAvatar([FromBody] UpdateAvatarDto update)
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

            if (update.AvatarPath != null)
            {
                // Delete old avatar if exists
                if (!string.IsNullOrEmpty(user.AvatarPath))
                {
                    var oldAvatarPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.AvatarPath);
                    if (System.IO.File.Exists(oldAvatarPath))
                    {
                        try
                        {
                            System.IO.File.Delete(oldAvatarPath);
                        }
                        catch
                        {
                            // Ignore deletion errors
                        }
                    }
                }
                user.AvatarPath = update.AvatarPath;
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
                AvatarPath = user.AvatarPath,
                Location = user.Location,
                Clinic = user.Clinic,
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

        [HttpGet("me/events")]
        public async Task<ActionResult<IEnumerable<UserEventDto>>> GetUserEvents()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var attendeeRows = await _context.EventAttendees
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (!attendeeRows.Any())
            {
                return Ok(new List<UserEventDto>());
            }

            var eventIds = attendeeRows.Select(a => a.EventId).Distinct().ToList();
            var events = await _context.Events
                .Where(e => eventIds.Contains(e.Id))
                .ToListAsync();

            var endedEventIds = events
                .Where(e =>
                {
                    if (e.EventDate == default) return false;
                    var eventDate = e.EventDate;
                    if (!string.IsNullOrWhiteSpace(e.Time))
                    {
                        var parts = e.Time.Split(':');
                        if (int.TryParse(parts[0], out var hours))
                        {
                            var minutes = 0;
                            if (parts.Length > 1)
                            {
                                int.TryParse(parts[1], out minutes);
                            }
                            eventDate = new DateTime(
                                eventDate.Year,
                                eventDate.Month,
                                eventDate.Day,
                                hours,
                                minutes,
                                0);
                        }
                    }
                    else
                    {
                        eventDate = new DateTime(
                            eventDate.Year,
                            eventDate.Month,
                            eventDate.Day,
                            23,
                            59,
                            59);
                    }
                    return DateTime.Now >= eventDate;
                })
                .Select(e => e.Id)
                .ToList();

            if (endedEventIds.Count > 0)
            {
                var existingCertificates = await _context.EventCertificates
                    .Where(c => c.UserId == userId && endedEventIds.Contains(c.EventId))
                    .ToListAsync();

                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                foreach (var eventItem in events.Where(e => endedEventIds.Contains(e.Id)))
                {
                    if (existingCertificates.Any(c => c.EventId == eventItem.Id))
                    {
                        continue;
                    }

                    var fileName = _context.EventCertificates
                        .Where(c => c.EventId == eventItem.Id && c.UserId == userId)
                        .Select(c => c.FileName)
                        .FirstOrDefault();

                    if (fileName != null)
                    {
                        continue;
                    }

                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                    if (user == null)
                    {
                        continue;
                    }

                    var pdfService = HttpContext.RequestServices.GetRequiredService<HospitalAPI.Services.Certificates.CertificatePdfService>();
                    var generatedFile = pdfService.GenerateCertificatePdfFile(user, eventItem, uploads);
                    _context.EventCertificates.Add(new HospitalAPI.Models.EventCertificate
                    {
                        EventId = eventItem.Id,
                        UserId = userId,
                        FileName = generatedFile,
                        IssuedAt = DateTime.UtcNow
                    });
                }

                await _context.SaveChangesAsync();
            }

            var certificates = await _context.EventCertificates
                .Where(c => c.UserId == userId && eventIds.Contains(c.EventId))
                .ToListAsync();

            var results = attendeeRows
                .Select(attendee =>
                {
                    var eventItem = events.FirstOrDefault(e => e.Id == attendee.EventId);
                    if (eventItem == null)
                    {
                        return null;
                    }

                    var cert = certificates.FirstOrDefault(c => c.EventId == attendee.EventId);
                    return new UserEventDto
                    {
                        EventId = eventItem.Id,
                        Title = eventItem.Title,
                        EventDate = eventItem.EventDate,
                        Venue = eventItem.Venue,
                        Price = eventItem.Price,
                        DiscountedPrice = eventItem.DiscountedPrice,
                        Currency = eventItem.Currency,
                        PaidPrice = attendee.PaidPrice,
                        PaidCurrency = attendee.PaidCurrency,
                        Status = attendee.Status,
                        CertificateFileName = cert?.FileName
                    };
                })
                .Where(result => result != null)
                .OrderByDescending(result => result!.EventDate)
                .Cast<UserEventDto>()
                .ToList();

            return Ok(results);
        }
    }
}

