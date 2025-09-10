using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }
        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default)
        {
            var messages = await _messageRepository.GetConversationAsync(userId, otherUserId, cancellationToken);
            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Content = m.Content,
                Timestamp = m.SentAt
            });

        }

        public async Task SendMessageAsync(MessageDto model, CancellationToken cancellationToken = default)
        {
            if(model.SenderId == Guid.Empty) throw new ArgumentException("SenderId is required", nameof(model.SenderId));
            if (model.ReceiverId == Guid.Empty) throw new ArgumentException("ReceiverId is required", nameof(model.ReceiverId));
            if (string.IsNullOrWhiteSpace(model.Content)) throw new ArgumentException("Content is required", nameof(model.Content));

            var message = new Message
            {
                Id = Guid.NewGuid(),
                SenderId = model.SenderId,
                ReceiverId = model.ReceiverId,
                Content = model.Content,
                SentAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(message, cancellationToken);

        }
    }
}
