using Chat.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography.X509Certificates;

namespace Chat.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IConversationService _conversationService;
        public ChatHub(IConversationService conversationService)
        {
            _conversationService = conversationService;
        }
        public async Task SendMessage(Guid conversationId, string message)
        {
            var userId = Context.User?.FindFirst("UserId")?.Value;
            var senderId = Guid.Parse(userId ?? throw new Exception("User ID not found in claims."));
            var sentMessage = await _conversationService.SendMessageAsync(senderId, conversationId, message);
            await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", new
            {
                sentMessage.Id,
                sentMessage.SenderId,
                sentMessage.Content,
                sentMessage.SentAt,
                sentMessage.ConversationId
            });
        }

        public async Task JoinConversation(Guid conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
            await Clients.Caller.SendAsync("JoinedConversation", conversationId);
        }

        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
            await Clients.Caller.SendAsync("LeftConversation", conversationId);
        }

        public async Task MarkMessageAsRead(Guid conversationId)
        {
            var userId = Context.User?.FindFirst("UserId")?.Value;
            var senderId = Guid.Parse(userId ?? throw new Exception("User ID not found in claims."));

            var mark = await _conversationService.MarkMessagesAsReadAsync(senderId, conversationId);
            if (mark.IsSuccess)
                await Clients.Group(conversationId.ToString()).SendAsync("MessagesMarkedAsRead", conversationId, senderId);

        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}
