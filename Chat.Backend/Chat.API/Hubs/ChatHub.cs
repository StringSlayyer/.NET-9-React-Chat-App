using Chat.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography.X509Certificates;

namespace Chat.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IConversationService _conversationService;
        private readonly ILogger<ChatHub> _logger;

        private static readonly Dictionary<string, HashSet<string>> GroupMembers = new();
        private static readonly object GroupLock = new();

        public ChatHub(IConversationService conversationService, ILogger<ChatHub> logger)
        {
            _conversationService = conversationService;
            _logger = logger;
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

            lock (GroupLock)
            {
                if(!GroupMembers.ContainsKey(conversationId.ToString()))
                    GroupMembers[conversationId.ToString()] = new HashSet<string>();
                GroupMembers[conversationId.ToString()].Add(Context.ConnectionId);
            }
            await Clients.Caller.SendAsync("JoinedConversation", conversationId);
        }

        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());

            lock (GroupLock)
            {
                if(GroupMembers.TryGetValue(conversationId.ToString(), out var connections))
                    connections.Remove(Context.ConnectionId);
            }

            await Clients.Caller.SendAsync("LeftConversation", conversationId);
        }

        public async Task MarkMessageAsRead(Guid conversationId)
        {
            var userId = Context.User?.FindFirst("UserId")?.Value;
            var senderId = Guid.Parse(userId ?? throw new Exception("User ID not found in claims."));

            bool inGroup;
            lock (GroupLock)
            {
                inGroup = GroupMembers.TryGetValue(conversationId.ToString(), out var members)
                    && members.Contains(Context.ConnectionId);
            }

            if (!inGroup)
            {
                _logger.LogWarning("User {UserId} attempted to mark messages as read in conversation {ConversationId} without being a member.", senderId, conversationId);
                return;
            }

            var mark = await _conversationService.MarkMessagesAsReadAsync(senderId, conversationId);
            if (mark.IsSuccess)
                await Clients.Group(conversationId.ToString()).SendAsync("MessagesMarkedAsRead", new { conversationId, senderId });

        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            lock (GroupLock)
            {
                foreach(var group in GroupMembers.Values) 
                    group.Remove(Context.ConnectionId);

                
            }
            await base.OnDisconnectedAsync(ex);
        }
    }
}
