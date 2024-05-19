using Microsoft.AspNetCore.Identity;

namespace WebApi.Models
{
    public class AppUser : IdentityUser
    {
        public virtual Cart Cart { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
