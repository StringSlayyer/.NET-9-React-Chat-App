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
    }
}
