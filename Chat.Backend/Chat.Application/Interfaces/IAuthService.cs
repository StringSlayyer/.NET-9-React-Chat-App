using Chat.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Guid> RegisterAsync(string username, string email, string password, string? firstName = null, string? lastName = null, CancellationToken cancellationToken = default);
        Task<TokenResponse> LoginAsync(string username, string password, CancellationToken cancellationToken = default);
    }
}
