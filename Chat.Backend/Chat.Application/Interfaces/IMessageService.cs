using Chat.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IMessageService
    {
        Task SendMessageAsync(MessageDto model, CancellationToken cancellationToken = default);
        Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default);
    }
}
