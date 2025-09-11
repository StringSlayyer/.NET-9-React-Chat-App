using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class ManageParticipantDTO
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }
    }
}
