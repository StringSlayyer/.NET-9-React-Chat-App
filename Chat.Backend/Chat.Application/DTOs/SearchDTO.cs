using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class SearchDTO
    {
        public List<UserDto>? Users { get; set; }
        public List<ConversationDTO>? Conversations { get; set; }


    }
}
