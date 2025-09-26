using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using System.Text.Json;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employee-certificates")]
    public class EmployeeCertificateController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeCertificateController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employee-certificates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeCertificate>>> GetEmployeeCertificates()
        {
            return await _context.EmployeeCertificates.ToListAsync();
        }

        // GET: api/employee-certificates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeCertificate>> GetEmployeeCertificate(int id)
        {
            var employeeCertificate = await _context.EmployeeCertificates.FindAsync(id);

            if (employeeCertificate == null)
            {
                return NotFound();
            }

            return employeeCertificate;
        }

        // GET: api/employee-certificates/language/{lang}
        [HttpGet("language/{lang}")]
        public async Task<ActionResult<IEnumerable<object>>> GetEmployeeCertificatesByLanguage(string lang)
        {
            try
            {
                var certificates = await _context.EmployeeCertificates.ToListAsync();
                
                var result = certificates.Select(certificate => new
                {
                    Id = certificate.Id,
                    EmployeeId = certificate.EmployeeId,
                    CertificateName = GetLocalizedCertificateName(certificate, lang),
                    CertificateImage = certificate.CertificateImage
                }).ToList();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetEmployeeCertificatesByLanguage: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/employee-certificates/{id}/language/{lang}
        [HttpGet("{id}/language/{lang}")]
        public async Task<ActionResult<object>> GetEmployeeCertificateByLanguage(int id, string lang)
        {
            try
            {
                var certificate = await _context.EmployeeCertificates.FindAsync(id);
                
                if (certificate == null)
                {
                    return NotFound($"Certificate with ID {id} not found");
                }
                
                var result = new
                {
                    Id = certificate.Id,
                    EmployeeId = certificate.EmployeeId,
                    CertificateName = GetLocalizedCertificateName(certificate, lang),
                    CertificateImage = certificate.CertificateImage
                };
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetEmployeeCertificateByLanguage: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/employee-certificates
        [HttpPost]
        public async Task<ActionResult<EmployeeCertificate>> PostEmployeeCertificate([FromBody] JsonElement jsonData)
        {
            try
            {
                var employeeCertificate = new EmployeeCertificate
                {
                    EmployeeId = jsonData.GetProperty("employeeId").GetInt32(),
                    CertificateImage = jsonData.GetProperty("certificateImage").GetString() ?? string.Empty,
                    CertificateName = jsonData.GetProperty("certificateName").GetString() ?? string.Empty,
                    CertificateNameEn = jsonData.TryGetProperty("certificateNameEn", out var nameEn) ? nameEn.GetString() : null,
                    CertificateNameRu = jsonData.TryGetProperty("certificateNameRu", out var nameRu) ? nameRu.GetString() : null
                };

                _context.EmployeeCertificates.Add(employeeCertificate);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetEmployeeCertificate", new { id = employeeCertificate.Id }, employeeCertificate);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in PostEmployeeCertificate: {ex.Message}");
                return BadRequest($"Invalid data: {ex.Message}");
            }
        }

        // PUT: api/employee-certificates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeCertificate(int id, [FromBody] JsonElement updateData)
        {
            var existingCertificate = await _context.EmployeeCertificates.FindAsync(id);
            if (existingCertificate == null)
            {
                return NotFound();
            }

            // Update only the fields that are provided
            if (updateData.TryGetProperty("certificateName", out JsonElement nameElement))
            {
                existingCertificate.CertificateName = nameElement.GetString();
            }
            
            if (updateData.TryGetProperty("certificateImage", out JsonElement imageElement))
            {
                existingCertificate.CertificateImage = imageElement.GetString();
            }

            // Update language fields
            if (updateData.TryGetProperty("certificateNameEn", out JsonElement nameEnElement))
            {
                existingCertificate.CertificateNameEn = nameEnElement.GetString();
            }
            
            if (updateData.TryGetProperty("certificateNameRu", out JsonElement nameRuElement))
            {
                existingCertificate.CertificateNameRu = nameRuElement.GetString();
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Certificate updated successfully", certificate = existingCertificate });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeCertificateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/employee-certificates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeCertificate(int id)
        {
            var employeeCertificate = await _context.EmployeeCertificates.FindAsync(id);
            if (employeeCertificate == null)
            {
                return NotFound();
            }

            _context.EmployeeCertificates.Remove(employeeCertificate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeCertificateExists(int id)
        {
            return _context.EmployeeCertificates.Any(e => e.Id == id);
        }

        private string GetLocalizedCertificateName(EmployeeCertificate certificate, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(certificate.CertificateNameEn) ? certificate.CertificateNameEn : certificate.CertificateName,
                "ru" => !string.IsNullOrEmpty(certificate.CertificateNameRu) ? certificate.CertificateNameRu : certificate.CertificateName,
                _ => certificate.CertificateName
            };
        }
    }
}
