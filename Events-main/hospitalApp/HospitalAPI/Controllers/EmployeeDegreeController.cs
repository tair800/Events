using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using System.Text.Json;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employee-degrees")]
    public class EmployeeDegreeController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeDegreeController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employee-degrees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDegree>>> GetEmployeeDegrees()
        {
            return await _context.EmployeeDegrees.ToListAsync();
        }

        // GET: api/employee-degrees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDegree>> GetEmployeeDegree(int id)
        {
            var employeeDegree = await _context.EmployeeDegrees.FindAsync(id);

            if (employeeDegree == null)
            {
                return NotFound();
            }

            return employeeDegree;
        }

        // GET: api/employee-degrees/language/{lang}
        [HttpGet("language/{lang}")]
        public async Task<ActionResult<IEnumerable<object>>> GetEmployeeDegreesByLanguage(string lang)
        {
            try
            {
                var degrees = await _context.EmployeeDegrees.ToListAsync();
                
                var result = degrees.Select(degree => new
                {
                    Id = degree.Id,
                    EmployeeId = degree.EmployeeId,
                    UniversityName = GetLocalizedUniversityName(degree, lang),
                    StartYear = degree.StartYear,
                    EndYear = degree.EndYear
                }).ToList();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetEmployeeDegreesByLanguage: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/employee-degrees/{id}/language/{lang}
        [HttpGet("{id}/language/{lang}")]
        public async Task<ActionResult<object>> GetEmployeeDegreeByLanguage(int id, string lang)
        {
            try
            {
                var degree = await _context.EmployeeDegrees.FindAsync(id);
                
                if (degree == null)
                {
                    return NotFound($"Degree with ID {id} not found");
                }
                
                var result = new
                {
                    Id = degree.Id,
                    EmployeeId = degree.EmployeeId,
                    UniversityName = GetLocalizedUniversityName(degree, lang),
                    StartYear = degree.StartYear,
                    EndYear = degree.EndYear
                };
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetEmployeeDegreeByLanguage: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/employee-degrees
        [HttpPost]
        public async Task<ActionResult<EmployeeDegree>> PostEmployeeDegree([FromBody] JsonElement jsonData)
        {
            try
            {
                var employeeDegree = new EmployeeDegree
                {
                    EmployeeId = jsonData.GetProperty("employeeId").GetInt32(),
                    UniversityName = jsonData.GetProperty("universityName").GetString() ?? string.Empty,
                    StartYear = jsonData.GetProperty("startYear").GetInt32(),
                    EndYear = jsonData.GetProperty("endYear").GetInt32(),
                    UniversityNameEn = jsonData.TryGetProperty("universityNameEn", out var nameEn) ? nameEn.GetString() : null,
                    UniversityNameRu = jsonData.TryGetProperty("universityNameRu", out var nameRu) ? nameRu.GetString() : null
                };

                _context.EmployeeDegrees.Add(employeeDegree);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetEmployeeDegree", new { id = employeeDegree.Id }, employeeDegree);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in PostEmployeeDegree: {ex.Message}");
                return BadRequest($"Invalid data: {ex.Message}");
            }
        }

        // PUT: api/employee-degrees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeDegree(int id, [FromBody] JsonElement updateData)
        {
            var existingDegree = await _context.EmployeeDegrees.FindAsync(id);
            if (existingDegree == null)
            {
                return NotFound();
            }

            // Update only provided fields
            if (updateData.TryGetProperty("universityName", out JsonElement uniEl))
            {
                existingDegree.UniversityName = uniEl.GetString();
            }

            if (updateData.TryGetProperty("startYear", out JsonElement startEl))
            {
                if (startEl.ValueKind == JsonValueKind.Number && startEl.TryGetInt32(out int startYear))
                {
                    existingDegree.StartYear = startYear;
                }
                else if (startEl.ValueKind == JsonValueKind.String && int.TryParse(startEl.GetString(), out int startYearStr))
                {
                    existingDegree.StartYear = startYearStr;
                }
            }

            if (updateData.TryGetProperty("endYear", out JsonElement endEl))
            {
                if (endEl.ValueKind == JsonValueKind.Number && endEl.TryGetInt32(out int endYear))
                {
                    existingDegree.EndYear = endYear;
                }
                else if (endEl.ValueKind == JsonValueKind.String && int.TryParse(endEl.GetString(), out int endYearStr))
                {
                    existingDegree.EndYear = endYearStr;
                }
            }

            // Update language fields
            if (updateData.TryGetProperty("universityNameEn", out JsonElement uniEnEl))
            {
                existingDegree.UniversityNameEn = uniEnEl.GetString();
            }
            
            if (updateData.TryGetProperty("universityNameRu", out JsonElement uniRuEl))
            {
                existingDegree.UniversityNameRu = uniRuEl.GetString();
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Degree updated successfully", degree = existingDegree });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDegreeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/employee-degrees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeDegree(int id)
        {
            var employeeDegree = await _context.EmployeeDegrees.FindAsync(id);
            if (employeeDegree == null)
            {
                return NotFound();
            }

            _context.EmployeeDegrees.Remove(employeeDegree);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeDegreeExists(int id)
        {
            return _context.EmployeeDegrees.Any(e => e.Id == id);
        }

        private string GetLocalizedUniversityName(EmployeeDegree degree, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(degree.UniversityNameEn) ? degree.UniversityNameEn : degree.UniversityName,
                "ru" => !string.IsNullOrEmpty(degree.UniversityNameRu) ? degree.UniversityNameRu : degree.UniversityName,
                _ => degree.UniversityName
            };
        }
    }
}
