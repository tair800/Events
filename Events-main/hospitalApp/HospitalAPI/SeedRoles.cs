using HospitalAPI.Data;
using HospitalAPI.Models;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalAPI
{
    public static class SeedRoles
    {
        public static async Task SeedAsync(HospitalDbContext context)
        {
            if (!context.Roles.Any())
            {
                await context.Roles.AddRangeAsync(
                    new Role { Name = "Admin" },
                    new Role { Name = "User" }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}

