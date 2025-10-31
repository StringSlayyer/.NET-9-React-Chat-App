using Chat.Application.DTOs;
using Chat.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Result<TokenResponse>> RegisterAsync(RegistrationDTO model, CancellationToken cancellationToken = default);
        Task<Result<TokenResponse>> LoginAsync(string username, string password, CancellationToken cancellationToken = default);
        Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordDTO model, CancellationToken cancellationToken = default);
    }
}
