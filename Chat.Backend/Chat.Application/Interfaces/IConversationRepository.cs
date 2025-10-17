using Chat.Application.Models;
using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IConversationRepository
    {
        Task<Conversation> CreateAsync(Conversation conversation, CancellationToken cancellationToken = default);
        Task<Conversation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Conversation>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task AddParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken = default);
        Task RemoveParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken = default);
        Task<ConversationParticipant?> GetParticipantInConversation(Guid conversationId, Guid userId, CancellationToken cancellationToken = default);
        Task MarkMessageAsRead(Guid userId, Guid conversationId);
        Task<IEnumerable<Conversation>> SearchConversationsAsync(Guid userId, string query, CancellationToken cancellationToken = default);
        Task<Result<Conversation>> GetConversationAsync(Guid userId1, Guid userId2, CancellationToken cancellationToken = default);
    }
}
