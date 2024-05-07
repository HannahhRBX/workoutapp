#nullable disable
using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutAPI.Data;
using WorkoutAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace WorkoutAPI.Controllers
{
    [Route("api/activities")]
    [ApiController]
    [Authorize]
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

        // GET: api/activities/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ActivityModel>>> GetActivitiesByUserId(string userId)
        {
            var activities = await _context.Activities.Where(a => a.UserID == userId).ToListAsync();

            if (activities == null)
            {
                return NotFound();
            }

            return activities;
        }

        
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // DTO for updating an existing activity
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

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine("UserID: {0}, ExistingActivity.UserID: {1}", userId, existingActivity.UserID);
            foreach (var claim in User.Claims)
            {
                Console.WriteLine("Claim Type: {0}, Claim Value: {1}", claim.Type, claim.Value);
            }
            // Check if the user is authorized to update the activity
            if (userId != existingActivity.UserID)
            {
                return Forbid();
            }

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

        // DTO for creating a new activity
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
            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine("UserID: {0}", userId);
            foreach (var claim in User.Claims)
            {
                Console.WriteLine("Claim Type: {0}, Claim Value: {1}", claim.Type, claim.Value);
            }
            // Check if the user is authorized to create the activity
            if (userId != activityModelDTO.UserID)
            {
                return Forbid();
            }

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
            var activityModel = await _context.Activities.FindAsync(id);
            if (activityModel == null)
            {
                return NotFound();
            }

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to delete the activity
            if (userId != activityModel.UserID)
            {
                return Forbid();
            }

            _context.Activities.Remove(activityModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityModelExists(int id)
        {
            return _context.Activities.Any(e => e.ID == id);
        }
    }
}
