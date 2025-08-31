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
        string GenerateToken(int userId);
        int GetUserIdFromClaimsPrincipal(ClaimsPrincipal user);
    }
}
