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
        private static readonly Dictionary<Guid, HashSet<string>> UserConnections = new();

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

            var conversationDto = await _conversationService.GetByIdForReciever(conversationId, senderId);
            if (!conversationDto.IsSuccess)
            {
                _logger.LogError("Failed to retrieve conversation {ConversationId} after sending message: {Error}", conversationId, conversationDto.ErrorMessage);
                return;
            }
            var participants = conversationDto.Data.Participants;

            foreach(var participant in participants)
            {
                if(UserConnections.TryGetValue(participant.Id, out var connections))
                {
                    foreach(var connectionId in connections)
                    {
                        await Clients.Client(connectionId).SendAsync("ConversationUpdated", conversationDto.Data);
                    }
                }
            }
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
            var userId = Context.User?.FindFirst("UserId")?.Value;
            if(Guid.TryParse(userId, out var uid))
            {
                lock (UserConnections)
                {
                    if (!UserConnections.ContainsKey(uid))
                    {
                        UserConnections[uid] = new HashSet<string>();
                    }
                    UserConnections[uid].Add(Context.ConnectionId);
                }
            }
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            lock (GroupLock)
            {
                foreach(var group in GroupMembers.Values) 
                    group.Remove(Context.ConnectionId);

                
            }
            var userId = Context.User?.FindFirst("UserId")?.Value;
            if (Guid.TryParse(userId, out var uid))
            {
                lock (UserConnections)
                {
                    if (UserConnections.TryGetValue(uid, out var conns))
                    {
                        conns.Remove(Context.ConnectionId);
                        _logger.LogInformation("Removing connection {ConnectionId} for user {UserId}", Context.ConnectionId, uid);
                        if (conns.Count == 0)
                        {
                            UserConnections.Remove(uid);
                            _logger.LogInformation("No more connections for user {UserId}, removed from UserConnections", uid);
                        }
                    }
                }
            }
            await base.OnDisconnectedAsync(ex);
                
        }
    }
}
