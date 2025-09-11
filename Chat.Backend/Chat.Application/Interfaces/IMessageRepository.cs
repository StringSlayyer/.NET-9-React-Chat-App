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
        Task<IEnumerable<Message>> GetRecentMessagesAsync(Guid conversationId, int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<Message>> GetMessagesPagedAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Message?> GetLastMessageAsync(Guid conversationId, CancellationToken cancellationToken = default);
    }
}
