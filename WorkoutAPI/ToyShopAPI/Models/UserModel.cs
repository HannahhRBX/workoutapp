using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace WorkoutAPI.Models
{
    public class UserModel : IdentityUser
    {
       
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Role { get; set; }
    }
}
