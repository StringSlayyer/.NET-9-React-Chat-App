using Chat.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Chat.API
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private TokenValidationParameters _tokenValidationParameters;
        private readonly ILogger<JwtMiddleware> _logger;
        private ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public JwtMiddleware(RequestDelegate next, ILogger<JwtMiddleware> logger, IConfiguration configuration)
        {
            _next = next;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _tokenValidationParameters = _tokenService.GetTokenValidationParameters();
            _logger.LogInformation("JwtMiddleware invoked for path: {Path}", context.Request.Path);

            var path = context.Request.Path;
            List<string> paths =
            [
                "/api/Auth/login",
                "/api/Auth/register",
                "/swagger/index.html",
                "/openapi/v1.json"
            ];
            if (paths.Contains(path.Value) )
            {
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null)
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                _logger.LogInformation("Recieved token: {Token}", token);

                var tokenHandler = new JwtSecurityTokenHandler();
                _tokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["JWT_SECRET_KEY"]));

                try
                {
                    var claimsPrincipal = tokenHandler.ValidateToken(token, _tokenValidationParameters, out var validatedToken);
                    var identity = new ClaimsIdentity(claimsPrincipal.Claims, "jwt");
                    context.User = new ClaimsPrincipal(identity);
                    var userId = context.User?.FindFirst("UserId")?.Value;
                    _logger.LogInformation("Token validated successfully for UserId: {UserId}", userId);
                    if (string.IsNullOrEmpty(userId))
                    {
                        _logger.LogWarning("UserId claim is missing in the token.");
                        context.Response.StatusCode = 401; // Unauthorized
                        await context.Response.WriteAsync("Unauthorized: UserId claim is missing.");
                        return;
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Token validation failed.");
                    context.Response.StatusCode = 401; // Unauthorized
                    await context.Response.WriteAsync("Unauthorized: Token validation failed.");
                    return;
                }
            }
            else
            {
                _logger.LogWarning("Authorization header is missing.");
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Unauthorized: Authorization header is missing.");
                return;
            }

            await _next(context);
        }
    }
}
