using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public UserController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
        {
            var users = await _userService.GetAllUsersAsync(cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
        {
            var user = await _userService.GetByIdAsync(id, cancellationToken);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("uploadProfilePicture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] UploadPictureDTO model)
        {
            var user = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if (user == null) return Unauthorized();
            await _userService.UploadProfilePictureAsync(user, model.ProfilePicture);
            return Ok();
        }

        [HttpGet("getProfilePicture")]
        public async Task<IActionResult> GetProfilePicture()
        {
            var user = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if(user == null) return Unauthorized();
            var picture = await _userService.GetProfilePictureAsync(user);
            if (!picture.IsSuccess) return NotFound(picture.ErrorMessage);
            return File(picture.Data.FileStream, picture.Data.ContentType);

        }
    }
}
