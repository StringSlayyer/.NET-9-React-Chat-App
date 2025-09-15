using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly ITokenService _tokenService;
        public ConversationController(IConversationService conversationService, ITokenService tokenService)
        {
            _conversationService = conversationService;
            _tokenService = tokenService;
        }

        [HttpPost("createConversation")]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDTO body)
        {
            var adminId = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if(body.AdminId == Guid.Empty)
            {
                return Unauthorized("Invalid token or user not found.");
            }
            var conversation = await _conversationService.CreateConversationAsync(body.ParticipantIds, body.AdminId, body.Name);
            var result = new ConversationDTO
            {
                Id = conversation.Id,
                Name = conversation.Name,
                ParticipantIds = conversation.Participants.Select(p => p.UserId)
            };
            return Ok(result);
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDTO body)
        {
            var senderId = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if (senderId == Guid.Empty)
            {
                return Unauthorized("Invalid token or user not found.");
            }
            var result = await _conversationService.SendMessageAsync(senderId, body.ConversationId, body.Content);
            return Ok(result);
        }

        [HttpGet("getMessagesPaged")]
        public async Task<IActionResult> GetMessagesPaged([FromQuery] GetPagedMessagesDTO body)
        {
            var userId = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if (userId == Guid.Empty)
            {
                return Unauthorized("Invalid token or user not found.");
            }
            var result = await _conversationService.GetMessagesPagedAsync(body.ConversationId, body.PageNumber, body.PageSize);
            return Ok(result);
        }


    }
}
