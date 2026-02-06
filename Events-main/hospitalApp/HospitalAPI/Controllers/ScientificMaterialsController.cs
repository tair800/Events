using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Models.DTOs;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScientificMaterialsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public ScientificMaterialsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/scientificmaterials
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScientificMaterial>>> GetScientificMaterials()
        {
            try
            {
                var materials = await _context.ScientificMaterials
                    .OrderByDescending(m => m.CreatedAt)
                    .ToListAsync();
                
                return Ok(materials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/scientificmaterials/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ScientificMaterial>> GetScientificMaterial(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid material ID");
                }

                var material = await _context.ScientificMaterials.FindAsync(id);

                if (material == null)
                {
                    return NotFound($"Material with ID {id} not found");
                }

                return Ok(material);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/scientificmaterials
        [HttpPost]
        public async Task<ActionResult<ScientificMaterial>> CreateScientificMaterial([FromBody] ScientificMaterialDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest("Material data is required");
                }

                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    return BadRequest("Name is required");
                }

                if (string.IsNullOrWhiteSpace(dto.Link))
                {
                    return BadRequest("Link is required");
                }

                var material = new ScientificMaterial
                {
                    Name = dto.Name,
                    Link = dto.Link,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Date = DateTime.UtcNow // Auto-set date to creation date
                };

                _context.ScientificMaterials.Add(material);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetScientificMaterial), new { id = material.Id }, material);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/scientificmaterials/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateScientificMaterial(int id, [FromBody] ScientificMaterialDto dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid material ID");
                }

                if (dto == null)
                {
                    return BadRequest("Material data is required");
                }

                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    return BadRequest("Name is required");
                }

                if (string.IsNullOrWhiteSpace(dto.Link))
                {
                    return BadRequest("Link is required");
                }

                var existingMaterial = await _context.ScientificMaterials.FindAsync(id);
                if (existingMaterial == null)
                {
                    return NotFound($"Material with ID {id} not found");
                }

                existingMaterial.Name = dto.Name;
                existingMaterial.Link = dto.Link;
                // Date should not be updated - it stays as creation date
                existingMaterial.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingMaterial);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ScientificMaterialExists(id))
                {
                    return NotFound($"Material with ID {id} not found");
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/scientificmaterials/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteScientificMaterial(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid material ID");
                }

                var material = await _context.ScientificMaterials.FindAsync(id);
                if (material == null)
                {
                    return NotFound($"Material with ID {id} not found");
                }

                _context.ScientificMaterials.Remove(material);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private async Task<bool> ScientificMaterialExists(int id)
        {
            return await _context.ScientificMaterials.AnyAsync(e => e.Id == id);
        }
    }
}

