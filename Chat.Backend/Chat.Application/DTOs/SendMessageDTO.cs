using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class SendMessageDTO
    {
        public Guid ConversationId { get; set; }
        public string Content { get; set; }
    }
}
