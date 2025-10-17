using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class GetOrCreateConversationDTO
    {
        public Guid User1 { get; set; } = Guid.Empty;
        public Guid User2 { get; set; }
    }
}
