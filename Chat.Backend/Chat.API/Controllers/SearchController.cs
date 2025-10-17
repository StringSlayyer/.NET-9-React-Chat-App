using Chat.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        private readonly ITokenService _tokenService;

        public SearchController(ISearchService searchService, ITokenService tokenService)
        {
            _searchService = searchService;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string query, CancellationToken cancellationToken)
        {
            var userId = _tokenService.GetUserIdFromClaimsPrincipal(User);
            if (userId == Guid.Empty) return Unauthorized();
            var result = await _searchService.SearchAsync(userId, query, cancellationToken);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);
            return Ok(result.Data);
        }

    }
}
