using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutAPI.Models
{
    public class ActivityModel
    {
        [Key]
        [Required]
        public int ID { get; set; }
        
        [Required]
        public string UserID { get; set; }

        [ForeignKey("UserID")]
        public UserModel User { get; set; }

        [MaxLength(150)]
        [Required]
        public string? Name { get; set; }

        [MaxLength(150)]
        [Required]
        public string? Description { get; set; }

        [MaxLength(50)]
        [Required]
        public string? Type { get; set; }

    }
}
