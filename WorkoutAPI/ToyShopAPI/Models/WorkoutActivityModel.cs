using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutAPI.Models
{
    public class WorkoutActivityModel
    {
        [Key]
        public int ID { get; set; }

        public int WorkoutID { get; set; }

        [ForeignKey("WorkoutID")]
        public WorkoutModel Workout { get; set; }

        public int ActivityID { get; set; }

        [ForeignKey("ActivityID")]
        public ActivityModel Activity { get; set; }

        [Required]
        public int Duration { get; set; }
    }
}
