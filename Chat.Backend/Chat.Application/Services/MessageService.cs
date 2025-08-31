using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class MessageService : IMessageService
    {
        public Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task SendMessageAsync(Guid guid, Guid receiverId, string content, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
