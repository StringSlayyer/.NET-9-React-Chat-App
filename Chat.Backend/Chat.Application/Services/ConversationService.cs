
using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
using Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore.Diagnostics;
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

        public async Task<Conversation> CreateConversationAsync(IEnumerable<Guid> participantIds, Guid? adminId, string? name = null, CancellationToken cancellationToken = default)
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
            return await _conversationRepository.CreateAsync(conversation, cancellationToken);

        }

        public Task<Result<ConversationDTO>> GetByIdForReciever(Guid conversationId, Guid currentUserId, CancellationToken cancellationToken = default)
        {
            if (conversationId == Guid.Empty)
                Result<ConversationDTO>.Failure("ConversationId cant be empty");
            if (currentUserId == Guid.Empty)
                Result<ConversationDTO>.Failure("CurrentUserId cant be empty");

            return _conversationRepository.GetByIdForReciever(conversationId, currentUserId, cancellationToken);
        }

        public async Task<IEnumerable<MessagesDTO>> GetMessagesPagedAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            if(conversationId == Guid.Empty)
                throw new ArgumentException("Conversation ID cannot be empty.", nameof(conversationId));
            if (pageNumber <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageNumber), "Page number must be greater than zero.");
            if (pageSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be greater than zero.");
            var messages = await _messageRepository.GetMessagesPagedAsync(conversationId, pageNumber, pageSize, cancellationToken);
            var result = messages.Select(m => new MessagesDTO
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ConversationId = m.ConversationId,
                Content = m.Content,
                SentAt = m.SentAt,
                IsRead = m.IsRead
            }).OrderByDescending(m => m.SentAt);

            return result.Reverse();
        }

        public async Task<Result<ConversationDTO>> GetOrCreateConversation(GetOrCreateConversationDTO request, CancellationToken cancellationToken = default)
        {
            if (request.User1 == Guid.Empty || request.User2 == Guid.Empty) return Result<ConversationDTO>.Failure("Missing user ID(s)");
            var existingConversation = await _conversationRepository.GetConversationAsync(request.User1, request.User2, cancellationToken);
            if (existingConversation.IsSuccess && existingConversation.Data != null)
            {
                var convo = existingConversation.Data;
                var convoDto = new ConversationDTO
                {
                    Id = convo.Id,
                    Name = convo.Name,
                    Participants = convo.Participants.Select(p => new ConversationParticipantDTO
                    {
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        Id = p.User.Id
                    }).ToList()
                };
                return Result<ConversationDTO>.Success(convoDto);
            }
            
            var participantIds = new List<Guid> { request.User1, request.User2 };
            var newConversation = await CreateConversationAsync(participantIds, request.User1, cancellationToken: cancellationToken);
            var newConvoDto = new ConversationDTO
            {
                Id = newConversation.Id,
                Name = newConversation.Name,
                Participants = newConversation.Participants.Select(p => new ConversationParticipantDTO
                {
                    FirstName = p.User.FirstName,
                    LastName = p.User.LastName,
                    Id = p.User.Id
                }).ToList()
            };
            return Result<ConversationDTO>.Success(newConvoDto);
        }

        public async Task<IEnumerable<Message>> GetRecentMessagesAsync(Guid conversationId, int count, CancellationToken cancellationToken = default)
        {
            if (conversationId == Guid.Empty)
                throw new ArgumentException("Conversation ID cannot be empty.", nameof(conversationId));
            if (count <= 0)
                throw new ArgumentOutOfRangeException(nameof(count), "Count must be greater than zero.");
            return await _messageRepository.GetRecentMessagesAsync(conversationId, count, cancellationToken);
        }

        public async Task<IEnumerable<ConversationDTO>> GetUserConversationsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("User ID cannot be empty.", nameof(userId));
            var conversations = await _conversationRepository.GetByUserIdAsync(userId, cancellationToken);
           
            

            return conversations;
        }

        public async Task<Result> MarkMessagesAsReadAsync(Guid userId, Guid conversationId)
        {
            if(userId == Guid.Empty) return Result.Failure("User ID cannot be empty.");
            if(conversationId == Guid.Empty) return Result.Failure("Conversation ID cannot be empty.");

            await _conversationRepository.MarkMessageAsRead(userId, conversationId);
            return Result.Success();

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
