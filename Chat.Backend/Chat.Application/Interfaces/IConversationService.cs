using Chat.Application.DTOs;
using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IConversationService
    {
        Task<Conversation> CreateConversationAsync(IEnumerable<Guid> participantIds, Guid? creatorId, string? name = null, CancellationToken cancellationToken = default);
        Task<IEnumerable<ConversationDTO>> GetUserConversationsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Message>> GetRecentMessagesAsync(Guid conversationId, int count, CancellationToken cancellationToken = default);
        Task<IEnumerable<MessagesDTO>> GetMessagesPagedAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Message> SendMessageAsync(Guid userId, Guid conversationId, string content, CancellationToken cancellationToken = default);
        Task AddParticipantAsync(Guid conversationId, Guid requestantId, Guid userId, CancellationToken cancellationToken = default);
        Task RemoveParticipantAsync(Guid conversationId, Guid requestantId, Guid userId, CancellationToken cancellationToken = default);
    }
}
