using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeSectionController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public HomeSectionController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/HomeSection
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HomeSection>>> GetHomeSections()
        {
            return await _context.HomeSections.ToListAsync();
        }

        // GET: api/HomeSection/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HomeSection>> GetHomeSection(int id)
        {
            var homeSection = await _context.HomeSections.FindAsync(id);

            if (homeSection == null)
            {
                return NotFound();
            }

            return homeSection;
        }

        // GET: api/HomeSection/first
        [HttpGet("first")]
        public async Task<ActionResult<HomeSection>> GetFirstHomeSection()
        {
            var homeSection = await _context.HomeSections.FirstOrDefaultAsync();

            if (homeSection == null)
            {
                return NotFound();
            }

            // Format image paths for frontend
            homeSection.Section2Image = ImagePathService.FormatContextualImagePath(homeSection.Section2Image, "admin");
            homeSection.Section3Image = ImagePathService.FormatContextualImagePath(homeSection.Section3Image, "admin");

            return homeSection;
        }

        // GET: api/HomeSection/first/language/{lang}
        [HttpGet("first/language/{lang}")]
        public async Task<ActionResult<HomeSection>> GetFirstHomeSectionByLanguage(string lang)
        {
            var homeSection = await _context.HomeSections.FirstOrDefaultAsync();

            if (homeSection == null)
            {
                return NotFound();
            }

            // Apply language-specific content
            homeSection.Section1Description = GetLocalizedSection1Description(homeSection, lang);
            homeSection.Section4Title = GetLocalizedSection4Title(homeSection, lang);
            homeSection.Section4Description = GetLocalizedSection4Description(homeSection, lang);
            homeSection.Section4PurposeTitle = GetLocalizedSection4PurposeTitle(homeSection, lang);
            homeSection.Section4PurposeDescription = GetLocalizedSection4PurposeDescription(homeSection, lang);

            // Format image paths for frontend
            homeSection.Section2Image = ImagePathService.FormatContextualImagePath(homeSection.Section2Image, "admin");
            homeSection.Section3Image = ImagePathService.FormatContextualImagePath(homeSection.Section3Image, "admin");

            return homeSection;
        }

        // PUT: api/HomeSection/first
        [HttpPut("first")]
        public async Task<IActionResult> PutFirstHomeSection(HomeSection homeSection)
        {
            var existingHomeSection = await _context.HomeSections.FirstOrDefaultAsync();
            
            if (existingHomeSection == null)
            {
                return NotFound();
            }

            // Update the existing record with new data
            existingHomeSection.Section1Description = homeSection.Section1Description;
            existingHomeSection.Section1DescriptionEn = homeSection.Section1DescriptionEn;
            existingHomeSection.Section1DescriptionRu = homeSection.Section1DescriptionRu;
            existingHomeSection.Section2Image = homeSection.Section2Image;
            existingHomeSection.Section3Image = homeSection.Section3Image;
            existingHomeSection.Section4Title = homeSection.Section4Title;
            existingHomeSection.Section4TitleEn = homeSection.Section4TitleEn;
            existingHomeSection.Section4TitleRu = homeSection.Section4TitleRu;
            existingHomeSection.Section4Description = homeSection.Section4Description;
            existingHomeSection.Section4DescriptionEn = homeSection.Section4DescriptionEn;
            existingHomeSection.Section4DescriptionRu = homeSection.Section4DescriptionRu;
            existingHomeSection.Section4PurposeTitle = homeSection.Section4PurposeTitle;
            existingHomeSection.Section4PurposeTitleEn = homeSection.Section4PurposeTitleEn;
            existingHomeSection.Section4PurposeTitleRu = homeSection.Section4PurposeTitleRu;
            existingHomeSection.Section4PurposeDescription = homeSection.Section4PurposeDescription;
            existingHomeSection.Section4PurposeDescriptionEn = homeSection.Section4PurposeDescriptionEn;
            existingHomeSection.Section4PurposeDescriptionRu = homeSection.Section4PurposeDescriptionRu;
            existingHomeSection.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // PUT: api/HomeSection/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHomeSection(int id, HomeSection homeSection)
        {
            if (id != homeSection.Id)
            {
                return BadRequest();
            }

            homeSection.UpdatedAt = DateTime.UtcNow;
            _context.Entry(homeSection).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HomeSectionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/HomeSection
        [HttpPost]
        public async Task<ActionResult<HomeSection>> PostHomeSection(HomeSection homeSection)
        {
            homeSection.CreatedAt = DateTime.UtcNow;
            homeSection.UpdatedAt = DateTime.UtcNow;
            
            _context.HomeSections.Add(homeSection);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHomeSection", new { id = homeSection.Id }, homeSection);
        }

        // DELETE: api/HomeSection/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHomeSection(int id)
        {
            var homeSection = await _context.HomeSections.FindAsync(id);
            if (homeSection == null)
            {
                return NotFound();
            }

            _context.HomeSections.Remove(homeSection);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool HomeSectionExists(int id)
        {
            return _context.HomeSections.Any(e => e.Id == id);
        }

        // Helper methods for localization
        private string GetLocalizedSection1Description(HomeSection homeSection, string lang)
        {
            return lang?.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(homeSection.Section1DescriptionEn) ? homeSection.Section1DescriptionEn : homeSection.Section1Description ?? "",
                "ru" => !string.IsNullOrEmpty(homeSection.Section1DescriptionRu) ? homeSection.Section1DescriptionRu : homeSection.Section1Description ?? "",
                _ => homeSection.Section1Description ?? ""
            };
        }

        private string GetLocalizedSection4Title(HomeSection homeSection, string lang)
        {
            return lang?.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(homeSection.Section4TitleEn) ? homeSection.Section4TitleEn : homeSection.Section4Title ?? "",
                "ru" => !string.IsNullOrEmpty(homeSection.Section4TitleRu) ? homeSection.Section4TitleRu : homeSection.Section4Title ?? "",
                _ => homeSection.Section4Title ?? ""
            };
        }

        private string GetLocalizedSection4Description(HomeSection homeSection, string lang)
        {
            return lang?.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(homeSection.Section4DescriptionEn) ? homeSection.Section4DescriptionEn : homeSection.Section4Description ?? "",
                "ru" => !string.IsNullOrEmpty(homeSection.Section4DescriptionRu) ? homeSection.Section4DescriptionRu : homeSection.Section4Description ?? "",
                _ => homeSection.Section4Description ?? ""
            };
        }

        private string GetLocalizedSection4PurposeTitle(HomeSection homeSection, string lang)
        {
            return lang?.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(homeSection.Section4PurposeTitleEn) ? homeSection.Section4PurposeTitleEn : homeSection.Section4PurposeTitle ?? "",
                "ru" => !string.IsNullOrEmpty(homeSection.Section4PurposeTitleRu) ? homeSection.Section4PurposeTitleRu : homeSection.Section4PurposeTitle ?? "",
                _ => homeSection.Section4PurposeTitle ?? ""
            };
        }

        private string GetLocalizedSection4PurposeDescription(HomeSection homeSection, string lang)
        {
            return lang?.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(homeSection.Section4PurposeDescriptionEn) ? homeSection.Section4PurposeDescriptionEn : homeSection.Section4PurposeDescription ?? "",
                "ru" => !string.IsNullOrEmpty(homeSection.Section4PurposeDescriptionRu) ? homeSection.Section4PurposeDescriptionRu : homeSection.Section4PurposeDescription ?? "",
                _ => homeSection.Section4PurposeDescription ?? ""
            };
        }
    }
}
