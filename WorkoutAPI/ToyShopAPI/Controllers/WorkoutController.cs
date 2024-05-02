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
    [Route("api/workouts")]
    [ApiController]
    [Authorize]
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
            // Find the workout with the given ID
            var workoutModel = await _context.Workouts
                .Include(w => w.WorkoutActivities)
                    .ThenInclude(wa => wa.Activity)
                .FirstOrDefaultAsync(w => w.ID == id);

            if (workoutModel == null)
            {
                return NotFound();
            }

            // Get the user's ID from the User property
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
                    ActivityDetails = new 
                    {
                        wa.Activity.Name,
                        wa.Activity.Description,
                        wa.Activity.Type
                        
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
                    .ThenInclude(wa => wa.Activity)
                .Where(w => w.UserID == userId)
                .ToListAsync();

            if (workoutModels == null || !workoutModels.Any())
            {
                return NotFound();
            }

            // Get the user's ID from the User property
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

        // DTO table to filter request input data to database
        public class WorkoutUpdateDTO
        {
            public int ID { get; set; }
            public string UserID { get; set; }
            public string Timestamp { get; set; }
        }

        // Function to check if the workout exists
        private bool WorkoutExists(int id)
        {
            return _context.Workouts.Any(e => e.ID == id);
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

            // Get user ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user is authorized to update the workout
            if (userId != workoutModel.UserID)
            {
                return Forbid();
            }

            workoutModel.Timestamp = workoutUpdateDTO.Timestamp;

            _context.Entry(workoutModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkoutExists(id))
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

            // Fetch the related Workout
            var workout = await _context.Workouts.FindAsync(workoutActivity.WorkoutID);

            if (workout == null)
            {
                return NotFound();
            }

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to update the workout activity
            if (userId != workout.UserID)
            {
                return Forbid();
            }

            // Fetch the workout related to the new WorkoutID
            var newWorkout = await _context.Workouts.FindAsync(WorkoutActivityUpdateDTO.WorkoutID);

            // Check if the new WorkoutID is owned by the same user
            if (newWorkout == null || newWorkout.UserID != userId)
            {
                return BadRequest("Cannot change to a workout owned by another user");
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

        // DTO table to filter request input data to database
        public class WorkoutActivityModelDTO
        {
            public int WorkoutID { get; set; }
            public int ActivityID { get; set; }
            public int Duration { get; set; }
        }

        // DTO table to filter response data to provide neccessary data to the user
        public class WorkoutActivityResponseDTO
        {
            public int ID { get; set; }
            public int WorkoutID { get; set; }
            public int ActivityID { get; set; }
            public int Duration { get; set; }
        }

        // POST: api/workouts/activity
        [HttpPost("activity")]
        public async Task<ActionResult<WorkoutActivityModel>> PostWorkoutActivity(WorkoutActivityModelDTO workoutActivityModelDTO)
        {
            // Fetch the related Workout
            var workout = await _context.Workouts.FindAsync(workoutActivityModelDTO.WorkoutID);

            if (workout == null)
            {
                return NotFound();
            }

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to create a workout activity for the workout
            if (userId != workout.UserID)
            {
                return Forbid();
            }

            var workoutActivityModel = new WorkoutActivityModel
            {
                WorkoutID = workoutActivityModelDTO.WorkoutID,
                ActivityID = workoutActivityModelDTO.ActivityID,
                Duration = workoutActivityModelDTO.Duration
            };

            _context.WorkoutActivity.Add(workoutActivityModel);
            await _context.SaveChangesAsync();

            var responseDTO = new WorkoutActivityResponseDTO
            {
                ID = workoutActivityModel.ID,
                WorkoutID = workoutActivityModel.WorkoutID,
                ActivityID = workoutActivityModel.ActivityID,
                Duration = workoutActivityModel.Duration
            };

            return CreatedAtAction(nameof(GetWorkoutActivity), new { id = responseDTO.ID }, responseDTO);
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

            // Fetch the related Workout
            var workout = await _context.Workouts.FindAsync(workoutActivity.WorkoutID);

            if (workout == null)
            {
                return NotFound();
            }

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to delete the workout activity
            if (userId != workout.UserID)
            {
                return Forbid();
            }

            _context.WorkoutActivity.Remove(workoutActivity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/workouts
        [HttpPost]
        public async Task<ActionResult<WorkoutModel>> PostActivityModel(WorkoutModelDTO workoutModelDTO)
        {
            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to create a workout
            if (userId != workoutModelDTO.UserID)
            {
                return Forbid();
            }

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

            // Get the user's ID from the User property
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authorized to delete the workout
            if (userId != WorkoutModel.UserID)
            {
                return Forbid();
            }

            _context.Workouts.Remove(WorkoutModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
