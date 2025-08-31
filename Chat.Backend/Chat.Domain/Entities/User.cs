using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Domain.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Username { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public string Password { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTimeOffset? LastLoggedInDate { get; private set; }
    }
}
