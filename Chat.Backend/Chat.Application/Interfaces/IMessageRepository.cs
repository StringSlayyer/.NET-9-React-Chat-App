using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message, CancellationToken cancellationToken = default);
        Task<IEnumerable<Message>> GetConversationAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken = default);
    }
}
