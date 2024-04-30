#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutAPI.Data;
using WorkoutAPI.Models;

namespace WorkoutAPI.Controllers
{
    [Route("api/activities")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActivitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Produc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityModel>>> GetActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        // GET: api/Produc/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityModel>> GetActivityModel(int id)
        {
            var ActivityModel = await _context.Activities.FindAsync(id);

            if (ActivityModel == null)
            {
                return NotFound();
            }

            return ActivityModel;
        }

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        public class ActivityUpdateDTO
        {
            public int ID { get; set; }
            public string UserID { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
            public string Description { get; set; }
        }

        // Existing code...

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivityModel(int id, [FromBody]ActivityUpdateDTO activityDTO)
        {
            if (id != activityDTO.ID)
            {
                return BadRequest();
            }

            var existingActivity = await _context.Activities.FindAsync(id);

            if (existingActivity == null)
            {
                return NotFound();
            }

            existingActivity.UserID = activityDTO.UserID;
            existingActivity.Name = activityDTO.Name;
            existingActivity.Type = activityDTO.Type;
            existingActivity.Description = activityDTO.Description;

            _context.Entry(existingActivity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityModelExists(id))
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

        public class ActivityModelDTO
        {
            public string UserID { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
        }

        // POST: api/Produc
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ActivityModel>> PostActivityModel(ActivityModelDTO activityModelDTO)
        {
            var activityModel = new ActivityModel
            {
                UserID = activityModelDTO.UserID,
                Name = activityModelDTO.Name,
                Description = activityModelDTO.Description,
                Type = activityModelDTO.Type
                // set other properties to their default values if needed
            };

            _context.Activities.Add(activityModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetActivityModel", new { id = activityModel.ID }, activityModel);
        }

        // DELETE: api/Produc/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityModel(int id)
        {
            var ActivityModel = await _context.Activities.FindAsync(id);
            if (ActivityModel == null)
            {
                return NotFound();
            }

            _context.Activities.Remove(ActivityModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityModelExists(int id)
        {
            return _context.Activities.Any(e => e.ID == id);
        }
    }
}
