using Chat.Application.Interfaces;
using Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Infrastructure.Data.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly AppDbContext _context;
        public ConversationRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken = default)
        {
            await _context.ConversationParticipants.AddAsync(new ConversationParticipant
            {
                ConversationId = conversationId,
                UserId = userId
            }, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<Conversation> CreateAsync(Conversation conversation, CancellationToken cancellationToken = default)
        {
            if(conversation == null) throw new ArgumentNullException(nameof(conversation));

            await _context.Conversations.AddAsync(conversation, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return conversation;
        }

        public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Conversation>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations.AsNoTracking()
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .ToListAsync(cancellationToken);
        }

        public async Task<ConversationParticipant?> GetParticipantInConversation(Guid conversationId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.ConversationParticipants
                .AsNoTracking()
                .FirstOrDefaultAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId, cancellationToken);
        }

        public async Task RemoveParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken = default)
        {
            await _context.ConversationParticipants
                .Where(cp => cp.ConversationId == conversationId && cp.UserId == userId)
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
