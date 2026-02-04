using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models.DTOs;
using HospitalAPI.Services.AdminAuth;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdminAuthService _adminAuthService;

        public AdminAuthController(IAdminAuthService adminAuthService)
        {
            _adminAuthService = adminAuthService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminForRegistrationDto adminForRegistration)
        {
            try
            {
                var admin = await _adminAuthService.RegisterAdmin(adminForRegistration);
                return StatusCode(201, admin);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAdmin([FromBody] AdminForLoginDto adminForLogin)
        {
            try
            {
                var token = await _adminAuthService.LoginAdmin(adminForLogin);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error: " + ex.Message });
            }
        }
    }
}

