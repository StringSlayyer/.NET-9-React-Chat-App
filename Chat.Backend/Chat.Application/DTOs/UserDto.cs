using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? ProfilePictureUrl { get; set; }

    }
}
