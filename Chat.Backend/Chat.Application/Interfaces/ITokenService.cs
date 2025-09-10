using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Guid userId);
        Guid GetUserIdFromClaimsPrincipal(ClaimsPrincipal user);
    }
}
