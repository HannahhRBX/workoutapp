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
    [Route("api/workouts")]
    [ApiController]
    public class WorkoutsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkoutsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Produc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkoutModel>>> GetActivities()
        {
            return await _context.Workouts.ToListAsync();
        }

        // GET: api/Produc/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetActivityModel(int id)
        {
            var workoutModel = await _context.Workouts
                .Include(w => w.WorkoutActivities)
                    .ThenInclude(wa => wa.Activity) // Include the related Activity entities
                .FirstOrDefaultAsync(w => w.ID == id);

            if (workoutModel == null)
            {
                return NotFound();
            }

            var result = new 
            {
                workoutModel.ID,
                workoutModel.UserID,
                workoutModel.Timestamp,
                WorkoutActivities = workoutModel.WorkoutActivities.Select(wa => new 
                {
                    wa.ID,
                    wa.ActivityID,
                    wa.Duration,
                    ActivityDetails = new // Include the Activity details
                    {
                        wa.Activity.Name,
                        wa.Activity.Description,
                        wa.Activity.Type
                        // include other Activity properties here if needed
                    }
                }).ToList()
            };

            return result;
        }

        // GET: api/workouts/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetWorkoutsByUserId(string userId)
        {
            var workoutModels = await _context.Workouts
                .Include(w => w.WorkoutActivities)
                    .ThenInclude(wa => wa.Activity) // Include the related Activity entities
                .Where(w => w.UserID == userId)
                .ToListAsync();

            if (workoutModels == null || !workoutModels.Any())
            {
                return NotFound();
            }

            var result = workoutModels.Select(workoutModel => new 
            {
                workoutModel.ID,
                workoutModel.UserID,
                workoutModel.Timestamp,
                WorkoutActivities = workoutModel.WorkoutActivities.Select(wa => new 
                {
                    wa.ID,
                    wa.ActivityID,
                    wa.Duration,
                    ActivityDetails = new
                    {
                        wa.Activity.Name,
                        wa.Activity.Description,
                        wa.Activity.Type
                    }
                }).ToList()
            }).ToList();

            return result;
        }

        public class WorkoutUpdateDTO
        {
            public int ID { get; set; }
            public string UserID { get; set; }
            public string Timestamp { get; set; }
        }

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivityModel(int id, WorkoutUpdateDTO workoutUpdateDTO)
        {
            if (id != workoutUpdateDTO.ID)
            {
                return BadRequest();
            }
            var workoutModel = await _context.Workouts.FindAsync(id);
            if (workoutModel == null)
            {
                return NotFound();
            }
            workoutModel.UserID = workoutUpdateDTO.UserID;
            workoutModel.Timestamp = workoutUpdateDTO.Timestamp;
            _context.Entry(workoutModel).State = EntityState.Modified;
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

        // POST: api/Produc
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        public class WorkoutActivityUpdateDTO
        {
            public int ID { get; set; }
            public int WorkoutID { get; set; }
            public int ActivityID { get; set; }
            public int Duration { get; set; }
        }
        private bool WorkoutActivityExists(int id)
        {
            return _context.WorkoutActivity.Any(e => e.ID == id);
        }

        // PUT: api/workouts/activity/id
        [HttpPut("activity/{id}")]
        public async Task<IActionResult> PutActivity(int id, WorkoutActivityUpdateDTO WorkoutActivityUpdateDTO)
        {
            if (id != WorkoutActivityUpdateDTO.ID)
            {
                return BadRequest();
            }
            var workoutActivity = await _context.WorkoutActivity.FindAsync(id);
            if (workoutActivity == null)
            {
                return NotFound();
            }
            workoutActivity.WorkoutID = WorkoutActivityUpdateDTO.WorkoutID;
            workoutActivity.ActivityID = WorkoutActivityUpdateDTO.ActivityID;
            workoutActivity.Duration = WorkoutActivityUpdateDTO.Duration;
            _context.Entry(workoutActivity).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkoutActivityExists(id))
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

        // GET: api/workouts/activity/id
        [HttpGet("activity/{id}")]
        public async Task<ActionResult<WorkoutActivityModel>> GetWorkoutActivity(int id)
        {
            var workoutActivity = await _context.WorkoutActivity.FindAsync(id);

            if (workoutActivity == null)
            {
                return NotFound();
            }

            return workoutActivity;
        }

        public class WorkoutActivityModelDTO
        {
            public int WorkoutID { get; set; }
            public int ActivityID { get; set; }
            public int Duration { get; set; }
        }
        // POST: api/workouts/activity
        [HttpPost("activity")]
        public async Task<ActionResult<WorkoutActivityModel>> PostWorkoutActivity(WorkoutActivityModelDTO workoutActivityModelDTO)
        {
            var workoutActivityModel = new WorkoutActivityModel
            {
                WorkoutID = workoutActivityModelDTO.WorkoutID,
                ActivityID = workoutActivityModelDTO.ActivityID,
                Duration = workoutActivityModelDTO.Duration
            };

            _context.WorkoutActivity.Add(workoutActivityModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkoutActivity), new { id = workoutActivityModel.ID }, workoutActivityModel);
        }
        public class WorkoutModelDTO
        {
            public string UserID { get; set; }
            public string Timestamp { get; set; }
        }
        
        // DELETE: api/workouts/activity/id
        [HttpDelete("activity/{id}")]
        public async Task<IActionResult> DeleteWorkoutActivity(int id)
        {
            var workoutActivity = await _context.WorkoutActivity.FindAsync(id);
            if (workoutActivity == null)
            {
                return NotFound();
            }

            _context.WorkoutActivity.Remove(workoutActivity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/workouts
        [HttpPost]
        public async Task<ActionResult<WorkoutModel>> PostActivityModel(WorkoutModelDTO workoutModelDTO)
        {
            var workoutModel = new WorkoutModel
            {
                UserID = workoutModelDTO.UserID,
                Timestamp = workoutModelDTO.Timestamp
            };

            _context.Workouts.Add(workoutModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetActivityModel", new { id = workoutModel.ID }, workoutModel);
        }

        // DELETE: api/Produc/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityModel(int id)
        {
            var WorkoutModel = await _context.Workouts.FindAsync(id);
            if (WorkoutModel == null)
            {
                return NotFound();
            }

            _context.Workouts.Remove(WorkoutModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityModelExists(int id)
        {
            return _context.Workouts.Any(e => e.ID == id);
        }
    }
}
