using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class ConversationDTO
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public IEnumerable<Guid> ParticipantIds { get; set; } = Enumerable.Empty<Guid>();
    }
}
