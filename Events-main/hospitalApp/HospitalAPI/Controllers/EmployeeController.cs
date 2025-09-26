using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            
            // Format image paths for frontend
            foreach (var employee in employees)
            {
                employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
                employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            }
            
            return Ok(employees);
        }

        // GET: api/employees/language/{lang} - Get employees by language
        [HttpGet("language/{lang}")]
        public async Task<ActionResult<IEnumerable<object>>> GetEmployeesByLanguage(string lang)
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                
                var result = employees.Select(employee => new
                {
                    Id = employee.Id,
                    Fullname = GetLocalizedFullname(employee, lang),
                    Field = GetLocalizedField(employee, lang),
                    Clinic = GetLocalizedClinic(employee, lang),
                    Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee"),
                    DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee"),
                    Phone = employee.Phone,
                    WhatsApp = employee.WhatsApp,
                    Email = employee.Email,
                    Location = GetLocalizedLocation(employee, lang),
                    FirstDesc = GetLocalizedFirstDesc(employee, lang),
                    SecondDesc = GetLocalizedSecondDesc(employee, lang),
                    CreatedAt = employee.CreatedAt,
                    UpdatedAt = employee.UpdatedAt,
                    Degrees = employee.Degrees,
                    Certificates = employee.Certificates
                }).ToList();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetEmployeesByLanguage: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/employees/{id}/language/{lang} - Get specific employee by language
        [HttpGet("{id:int}/language/{lang}")]
        public async Task<ActionResult<object>> GetEmployeeByLanguage(int id, string lang)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid employee ID");
                }

                var employee = await _context.Employees.FindAsync(id);

                if (employee == null)
                {
                    return NotFound($"Employee with ID {id} not found");
                }

                // Manually fetch related data
                employee.Degrees = await _context.EmployeeDegrees
                    .Where(ed => ed.EmployeeId == id)
                    .ToListAsync();
                    
                employee.Certificates = await _context.EmployeeCertificates
                    .Where(ec => ec.EmployeeId == id)
                    .ToListAsync();

                var result = new
                {
                    Id = employee.Id,
                    Fullname = GetLocalizedFullname(employee, lang),
                    Field = GetLocalizedField(employee, lang),
                    Clinic = GetLocalizedClinic(employee, lang),
                    Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee"),
                    DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee"),
                    Phone = employee.Phone,
                    WhatsApp = employee.WhatsApp,
                    Email = employee.Email,
                    Location = GetLocalizedLocation(employee, lang),
                    FirstDesc = GetLocalizedFirstDesc(employee, lang),
                    SecondDesc = GetLocalizedSecondDesc(employee, lang),
                    CreatedAt = employee.CreatedAt,
                    UpdatedAt = employee.UpdatedAt,
                    Degrees = employee.Degrees,
                    Certificates = employee.Certificates
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/employees/recent - Get recent employees (last 5)
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetRecentEmployees()
        {
            var recentEmployees = await _context.Employees
                .OrderByDescending(e => e.CreatedAt)
                .Take(5)
                .ToListAsync();
            
            // Format image paths for frontend
            foreach (var employee in recentEmployees)
            {
                employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
                employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            }
            
            return Ok(recentEmployees);
        }

        // GET: api/employees/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            
            if (employee == null)
            {
                return NotFound();
            }
            
            // Manually fetch related data
            employee.Degrees = await _context.EmployeeDegrees
                .Where(ed => ed.EmployeeId == id)
                .ToListAsync();
                
            employee.Certificates = await _context.EmployeeCertificates
                .Where(ec => ec.EmployeeId == id)
                .ToListAsync();
            
            // Format image paths for frontend
            employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
            employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            
            return employee;
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            employee.CreatedAt = DateTime.UtcNow;
            employee.UpdatedAt = DateTime.UtcNow;
            
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            try
            {
                // Check model validation
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check required fields manually
                if (string.IsNullOrEmpty(employee.Fullname))
                {
                    return BadRequest("Fullname is required");
                }
                if (string.IsNullOrEmpty(employee.Field))
                {
                    return BadRequest("Field is required");
                }
                if (string.IsNullOrEmpty(employee.Clinic))
                {
                    return BadRequest("Clinic is required");
                }

                var existingEmployee = await _context.Employees.FindAsync(id);
                if (existingEmployee == null)
                {
                    return NotFound();
                }

                existingEmployee.Fullname = employee.Fullname;
                existingEmployee.Field = employee.Field;
                existingEmployee.Clinic = employee.Clinic;
                existingEmployee.Image = employee.Image;
                existingEmployee.DetailImage = employee.DetailImage;
                existingEmployee.Phone = employee.Phone;
                existingEmployee.WhatsApp = employee.WhatsApp;
                existingEmployee.Email = employee.Email;
                existingEmployee.Location = employee.Location;
                existingEmployee.FirstDesc = employee.FirstDesc;
                existingEmployee.SecondDesc = employee.SecondDesc;
                
                // Update English language fields
                existingEmployee.FullnameEn = employee.FullnameEn;
                existingEmployee.FieldEn = employee.FieldEn;
                existingEmployee.ClinicEn = employee.ClinicEn;
                existingEmployee.LocationEn = employee.LocationEn;
                existingEmployee.FirstDescEn = employee.FirstDescEn;
                existingEmployee.SecondDescEn = employee.SecondDescEn;
                
                // Update Russian language fields
                existingEmployee.FullnameRu = employee.FullnameRu;
                existingEmployee.FieldRu = employee.FieldRu;
                existingEmployee.ClinicRu = employee.ClinicRu;
                existingEmployee.LocationRu = employee.LocationRu;
                existingEmployee.FirstDescRu = employee.FirstDescRu;
                existingEmployee.SecondDescRu = employee.SecondDescRu;
                
                existingEmployee.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingEmployee);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateEmployee: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest($"Error processing request: {ex.Message}");
            }
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/employees/{id}/upload-image
        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadEmployeeImage(int id, IFormFile file)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only JPG, JPEG, PNG, GIF, and WebP files are allowed.");
                }

                // Validate file size (max 10MB)
                if (file.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("File size too large. Maximum size is 10MB.");
                }

                // Create uploads directory if it doesn't exist
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate unique filename
                var fileName = $"employee_{id}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update employee image path
                employee.Image = $"uploads/{fileName}";
                employee.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = "Image uploaded successfully.",
                    imagePath = employee.Image
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "An error occurred while uploading the image.",
                    error = ex.Message 
                });
            }
        }

        // POST: api/employees/{id}/upload-detail-image
        [HttpPost("{id}/upload-detail-image")]
        public async Task<IActionResult> UploadEmployeeDetailImage(int id, IFormFile file)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only JPG, JPEG, PNG, GIF, and WebP files are allowed.");
                }

                // Validate file size (max 10MB)
                if (file.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("File size too large. Maximum size is 10MB.");
                }

                // Create uploads directory if it doesn't exist
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate unique filename
                var fileName = $"employee_detail_{id}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update employee detail image path
                employee.DetailImage = $"uploads/{fileName}";
                employee.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = "Detail image uploaded successfully.",
                    imagePath = employee.DetailImage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "An error occurred while uploading the detail image.",
                    error = ex.Message 
                });
            }
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }

        // Helper methods for localized content
        private string GetLocalizedFullname(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.FullnameEn) ? employee.FullnameEn : employee.Fullname,
                "ru" => !string.IsNullOrEmpty(employee.FullnameRu) ? employee.FullnameRu : employee.Fullname,
                _ => employee.Fullname
            };
        }

        private string GetLocalizedField(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.FieldEn) ? employee.FieldEn : employee.Field,
                "ru" => !string.IsNullOrEmpty(employee.FieldRu) ? employee.FieldRu : employee.Field,
                _ => employee.Field
            };
        }

        private string GetLocalizedClinic(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.ClinicEn) ? employee.ClinicEn : employee.Clinic,
                "ru" => !string.IsNullOrEmpty(employee.ClinicRu) ? employee.ClinicRu : employee.Clinic,
                _ => employee.Clinic
            };
        }

        private string GetLocalizedLocation(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.LocationEn) ? employee.LocationEn : employee.Location,
                "ru" => !string.IsNullOrEmpty(employee.LocationRu) ? employee.LocationRu : employee.Location,
                _ => employee.Location
            };
        }

        private string GetLocalizedFirstDesc(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.FirstDescEn) ? employee.FirstDescEn : employee.FirstDesc,
                "ru" => !string.IsNullOrEmpty(employee.FirstDescRu) ? employee.FirstDescRu : employee.FirstDesc,
                _ => employee.FirstDesc
            };
        }

        private string GetLocalizedSecondDesc(Employee employee, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(employee.SecondDescEn) ? employee.SecondDescEn : employee.SecondDesc,
                "ru" => !string.IsNullOrEmpty(employee.SecondDescRu) ? employee.SecondDescRu : employee.SecondDesc,
                _ => employee.SecondDesc
            };
        }
    }
}
