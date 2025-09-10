using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("getMesssages")]
        public async Task<IActionResult> GetMessagesAsync([FromQuery]Guid userId, Guid otherUserId)
        {
            var messages = await _messageService.GetMessagesAsync(userId, otherUserId);
            return Ok(messages);
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessageAsync([FromBody] MessageDto model)
        {
            await _messageService.SendMessageAsync(model);
            return Ok();
        }
    }
}
