using HospitalAPI.Data;
using HospitalAPI.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;

namespace HospitalAPI
{
    public static class SeedAdminData
    {
        public static async Task SeedAsync(HospitalDbContext context)
        {
            if (!context.Admins.Any())
            {
                CreatePasswordHash("adminpassword", out byte[] passwordHash, out byte[] passwordSalt);

                await context.Admins.AddAsync(
                    new Admin
                    {
                        Username = "admin",
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt
                    }
                );
                await context.SaveChangesAsync();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}

