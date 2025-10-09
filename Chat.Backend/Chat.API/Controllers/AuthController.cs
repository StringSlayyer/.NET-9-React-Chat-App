using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthService authService, ITokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var result = await _authService.LoginAsync(model.Username, model.Password);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegistrationDTO model)
        {
            var result = await _authService.RegisterAsync(model);
            return Ok(result);
        }

        [HttpGet("getUserId")]
        public async Task<IActionResult> GetUserIdFromToken()
        {
            var userId = _tokenService.GetUserIdFromClaimsPrincipal(User);
            return Ok(new {UserId = userId });
        }
    }
}
