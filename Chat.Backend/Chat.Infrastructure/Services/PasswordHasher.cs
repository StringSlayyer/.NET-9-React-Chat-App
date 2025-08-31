using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Infrastructure.Services
{
    public class PasswordHasher
    {
        public string HashPassword(string password)
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt(12); 
            return BCrypt.Net.BCrypt.HashPassword(password, salt);
        }

       
        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

    }
}
