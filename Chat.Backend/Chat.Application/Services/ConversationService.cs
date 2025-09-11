using Chat.Application.Interfaces;
using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;
        public ConversationService(IConversationRepository conversationRepository, IMessageRepository messageRepository)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
        }

        public async Task AddParticipantAsync(Guid conversationId, Guid requestantId, Guid userId, CancellationToken cancellationToken = default)
        {
            var admin = await _conversationRepository.GetParticipantInConversation(conversationId, requestantId, cancellationToken);
            if (admin == null || !admin.IsAdmin)
                throw new UnauthorizedAccessException("Only admins can add participants.");
            var existingParticipant = await _conversationRepository.GetParticipantInConversation(conversationId, userId, cancellationToken);
            if (existingParticipant != null)
                throw new InvalidOperationException("User is already a participant in the conversation.");
            await _conversationRepository.AddParticipantAsync(conversationId, userId, cancellationToken);
        }

        public Task<Conversation> CreateConversationAsync(IEnumerable<Guid> participantIds, Guid? adminId, string? name = null, CancellationToken cancellationToken = default)
        {
            if(participantIds == null || !participantIds.Any())
                throw new ArgumentException("At least one participant is required to create a conversation.", nameof(participantIds));
            var conversation = new Conversation();
            if(!string.IsNullOrWhiteSpace(name))
            {
                conversation.Name = name;
            }
            conversation.Participants = participantIds.Select(id => new ConversationParticipant
            {
                UserId = id,
                ConversationId = conversation.Id,
                IsAdmin = id == adminId
            }).ToList();
            return _conversationRepository.CreateAsync(conversation, cancellationToken);

        }

        public Task<IEnumerable<Message>> GetMessagesPagedAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            if(conversationId == Guid.Empty)
                throw new ArgumentException("Conversation ID cannot be empty.", nameof(conversationId));
            if (pageNumber <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageNumber), "Page number must be greater than zero.");
            if (pageSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be greater than zero.");
            return _messageRepository.GetMessagesPagedAsync(conversationId, pageNumber, pageSize, cancellationToken);
        }

        public Task<IEnumerable<Message>> GetRecentMessagesAsync(Guid conversationId, int count, CancellationToken cancellationToken = default)
        {
            if (conversationId == Guid.Empty)
                throw new ArgumentException("Conversation ID cannot be empty.", nameof(conversationId));
            if (count <= 0)
                throw new ArgumentOutOfRangeException(nameof(count), "Count must be greater than zero.");
            return _messageRepository.GetRecentMessagesAsync(conversationId, count, cancellationToken);
        }

        public Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("User ID cannot be empty.", nameof(userId));
            return _conversationRepository.GetByUserIdAsync(userId, cancellationToken);
        }

        public async Task RemoveParticipantAsync(Guid conversationId, Guid requestantId, Guid userId, CancellationToken cancellationToken = default)
        {
            var admin = await _conversationRepository.GetParticipantInConversation(conversationId, requestantId, cancellationToken);
            if (admin == null || !admin.IsAdmin)
                throw new UnauthorizedAccessException("Only admins can remove participants.");
            var participant = await _conversationRepository.GetParticipantInConversation(conversationId, userId, cancellationToken);
            if (participant == null)
                throw new InvalidOperationException("User is not a participant in the conversation.");
            await _conversationRepository.RemoveParticipantAsync(conversationId, userId, cancellationToken);
        }

        public async Task<Message> SendMessageAsync(Guid userId, Guid conversationId, string content, CancellationToken cancellationToken = default)
        {
            var participant = await _conversationRepository.GetParticipantInConversation(conversationId, userId, cancellationToken);
            if (participant == null)
                throw new UnauthorizedAccessException("User is not a participant in the conversation.");
            var message = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = conversationId,
                SenderId = userId,
                Content = content,
                SentAt = DateTime.UtcNow
            };
            await _messageRepository.AddAsync(message, cancellationToken);
            return message;
        }
    }
}
