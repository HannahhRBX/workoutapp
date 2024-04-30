using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutAPI.Models
{
    public class WorkoutModel
    {
        public WorkoutModel()
        {
            WorkoutActivities = new List<WorkoutActivityModel>();
        }

        [Key]
        [Required]
        public int ID { get; set; }

        [Required]
        public string? UserID { get; set; }

        [ForeignKey("UserID")]
        public UserModel? User { get; set; }

        [Required]
        public string? Timestamp { get; set; }

        public ICollection<WorkoutActivityModel> WorkoutActivities { get; set; }
    }
}
