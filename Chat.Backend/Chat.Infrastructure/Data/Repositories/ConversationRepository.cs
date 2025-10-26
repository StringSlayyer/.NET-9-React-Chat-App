using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
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

            var loadedConversation = await _context.Conversations
            .Include(c => c.Participants)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.Id == conversation.Id, cancellationToken);

            return loadedConversation!;
        }

        public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<Result<ConversationDTO>> GetByIdForReciever(Guid conversationId, Guid currentUserId, CancellationToken cancellationToken)
        {
            var conversation = await _context.Conversations
                .Include(c=> c.Participants)
                .ThenInclude(cp => cp.User)
                .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
                .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

            if (conversation == null) Result.Failure("Conversation not found.");

            var unreadCount = await _context.Messages
                .CountAsync(m =>
                m.ConversationId == conversationId
                && m.SenderId != currentUserId && !m.IsRead);

            var dto = new ConversationDTO
            {
                Id = conversation.Id,
                Name = conversation.Name,
                IsGroup = conversation.IsGroup,
                Participants = conversation.Participants.Select(p => new ConversationParticipantDTO
                {
                    Id = p.User.Id,
                    FirstName = p.User.FirstName,
                    LastName = p.User.LastName
                }).ToList(),
                LastMessage = conversation.Messages
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => new MessagesDTO
                    {
                        Id = m.Id,
                        Content = m.Content,
                        SentAt = m.SentAt,
                        IsRead = m.IsRead
                    })
                    .FirstOrDefault(),
                UnreadMessagesCount = unreadCount
            };

            return Result<ConversationDTO>.Success(dto);
        }

        public async Task<IEnumerable<ConversationDTO>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var conversations = await _context.Conversations
                .AsNoTracking()
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Select(c => new ConversationDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Participants = c.Participants.Select(p => new ConversationParticipantDTO
                    {
                        Id = p.User.Id,
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName
                    }).ToList(),
                    LastMessage = c.Messages
                        .OrderByDescending(m => m.SentAt)
                        .Select(m => new MessagesDTO
                        {
                            Id = m.Id,
                            Content = m.Content,
                            SentAt = m.SentAt,
                            IsRead = m.IsRead
                        })
                        .FirstOrDefault(),
                    UnreadMessagesCount = c.Messages.Count(m => m.SenderId != userId && !m.IsRead)
                })
                .OrderByDescending(c => c.LastMessage.SentAt)
                .ToListAsync(cancellationToken);

            return conversations;
            /*.Include(c=> c.Participants)
                .ThenInclude(cp => cp.User)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(c => c.Messages.Max(m => m.SentAt))
            .ToListAsync(cancellationToken);*/
        }

        public async Task<Result<Conversation>> GetConversationAsync(Guid userId1, Guid userId2, CancellationToken cancellationToken = default)
        {
            var existing = await _context.Conversations
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(c => !c.IsGroup &&
                    c.Participants.Any(p => p.UserId == userId1) &&
                    c.Participants.Any(p => p.UserId == userId2), cancellationToken);

            if (existing != null) return Result<Conversation>.Success(existing);
            return Result<Conversation>.Failure("Conversation not found.");
        }

        public async Task<ConversationParticipant?> GetParticipantInConversation(Guid conversationId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.ConversationParticipants
                .AsNoTracking()
                .FirstOrDefaultAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId, cancellationToken);
        }

        public async Task MarkMessageAsRead(Guid userId, Guid conversationId)
        {
            var messages = await _context.Messages.Where(m => m.ConversationId == conversationId && m.SenderId != userId && !m.IsRead).ToListAsync();
            foreach (var message in messages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

        public async Task RemoveParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken = default)
        {
            await _context.ConversationParticipants
                .Where(cp => cp.ConversationId == conversationId && cp.UserId == userId)
                .ExecuteDeleteAsync(cancellationToken);
        }

        public async Task<IEnumerable<Conversation>> SearchConversationsAsync(Guid userId, string query, CancellationToken cancellationToken = default)
        {
            query = query.ToLower();
            return await _context.Conversations.AsNoTracking()
                .Where(c => c.Participants.Any(p => p.UserId == userId) &&
                (c.Name.ToLower().Contains(query) || c.Participants.Any(p => (p.User.FirstName + " " + p.User.LastName).ToLower().Contains(query) ||
                p.User.Username.ToLower().Contains(query))))
                .Include(c => c.Participants)
                .ThenInclude(c => c.User)
                .Take(10)
                .ToListAsync(cancellationToken);
        }
    }
}
