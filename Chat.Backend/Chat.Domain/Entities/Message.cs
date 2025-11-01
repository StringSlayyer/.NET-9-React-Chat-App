using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid ConversationId { get; set; }
        public Conversation Conversation { get; set; }

        public Guid SenderId { get; set; }
        public User Sender { get; set; }

        public string Content { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
        public bool IsRead { get; set; } = false;
    }
}
