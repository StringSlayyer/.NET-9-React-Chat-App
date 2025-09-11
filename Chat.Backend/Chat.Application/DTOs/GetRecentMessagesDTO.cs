using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class GetRecentMessagesDTO
    {
        public Guid ConversationId { get; set; }
        public int Count { get; set; } = 50; // Default to last 50 messages
    }
}
