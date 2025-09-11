using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class CreateConversationDTO
    {
        public IEnumerable<Guid> ParticipantIds { get; set; } = Enumerable.Empty<Guid>();
        public Guid? AdminId { get; set; }
        public string? Name { get; set; }
    }
}
