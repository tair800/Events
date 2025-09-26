using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventTimelineController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EventTimelineController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/eventtimeline/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<EventTimeline>>> GetTimelineByEvent(int eventId)
        {
            try
            {
                var timeline = await _context.EventTimeline
                    .Where(et => et.EventId == eventId)
                    .OrderBy(et => et.OrderIndex)
                    .ToListAsync();

                return Ok(timeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/eventtimeline/event/{eventId}/language/{lang}
        [HttpGet("event/{eventId}/language/{lang}")]
        public async Task<ActionResult<IEnumerable<EventTimeline>>> GetTimelineByEventLanguage(int eventId, string lang)
        {
            try
            {
                var timeline = await _context.EventTimeline
                    .Where(et => et.EventId == eventId)
                    .OrderBy(et => et.OrderIndex)
                    .ToListAsync();

                // Apply language-specific content
                foreach (var timelineItem in timeline)
                {
                    timelineItem.Title = GetLocalizedTitle(timelineItem, lang);
                    timelineItem.Description = GetLocalizedDescription(timelineItem, lang);
                    timelineItem.Info = GetLocalizedInfo(timelineItem, lang);
                }

                return Ok(timeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/eventtimeline/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventTimeline>> GetEventTimeline(int id)
        {
            try
            {
                var eventTimeline = await _context.EventTimeline
                    .Include(et => et.Event)
                    .FirstOrDefaultAsync(et => et.Id == id);

                if (eventTimeline == null)
                {
                    return NotFound();
                }

                return Ok(eventTimeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/eventtimeline
        [HttpPost]
        public async Task<ActionResult<EventTimeline>> CreateEventTimeline(EventTimeline eventTimeline)
        {
            try
            {
                _context.EventTimeline.Add(eventTimeline);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEventTimeline), new { id = eventTimeline.Id }, eventTimeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/eventtimeline/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEventTimeline(int id, EventTimeline eventTimeline)
        {
            if (id != eventTimeline.Id)
            {
                return BadRequest();
            }

            try
            {
                var existingTimeline = await _context.EventTimeline.FindAsync(id);
                if (existingTimeline == null)
                {
                    return NotFound();
                }

                // Update all fields including language fields
                existingTimeline.EventId = eventTimeline.EventId;
                existingTimeline.StartTime = eventTimeline.StartTime;
                existingTimeline.EndTime = eventTimeline.EndTime;
                existingTimeline.Title = eventTimeline.Title;
                existingTimeline.Description = eventTimeline.Description;
                existingTimeline.Info = eventTimeline.Info;
                existingTimeline.OrderIndex = eventTimeline.OrderIndex;
                existingTimeline.TitleEn = eventTimeline.TitleEn;
                existingTimeline.DescriptionEn = eventTimeline.DescriptionEn;
                existingTimeline.InfoEn = eventTimeline.InfoEn;
                existingTimeline.TitleRu = eventTimeline.TitleRu;
                existingTimeline.DescriptionRu = eventTimeline.DescriptionRu;
                existingTimeline.InfoRu = eventTimeline.InfoRu;
                existingTimeline.UpdatedAt = DateTime.UtcNow.ToString();

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventTimelineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/eventtimeline/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventTimeline(int id)
        {
            try
            {
                var eventTimeline = await _context.EventTimeline.FindAsync(id);
                if (eventTimeline == null)
                {
                    return NotFound();
                }

                _context.EventTimeline.Remove(eventTimeline);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool EventTimelineExists(int id)
        {
            return _context.EventTimeline.Any(e => e.Id == id);
        }

        // Helper methods for localization
        private string GetLocalizedTitle(EventTimeline timeline, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(timeline.TitleEn) ? timeline.TitleEn : timeline.Title,
                "ru" => !string.IsNullOrEmpty(timeline.TitleRu) ? timeline.TitleRu : timeline.Title,
                _ => timeline.Title
            };
        }

        private string GetLocalizedDescription(EventTimeline timeline, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(timeline.DescriptionEn) ? timeline.DescriptionEn : timeline.Description,
                "ru" => !string.IsNullOrEmpty(timeline.DescriptionRu) ? timeline.DescriptionRu : timeline.Description,
                _ => timeline.Description
            };
        }

        private string GetLocalizedInfo(EventTimeline timeline, string lang)
        {
            return lang.ToLower() switch
            {
                "en" => !string.IsNullOrEmpty(timeline.InfoEn) ? timeline.InfoEn : timeline.Info,
                "ru" => !string.IsNullOrEmpty(timeline.InfoRu) ? timeline.InfoRu : timeline.Info,
                _ => timeline.Info
            };
        }
    }
}
