using Chat.Application.DTOs;
using Chat.Application.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
        Task<Result<ReturnFileDTO>> GetProfilePictureAsync(Guid guid);
        Task UploadProfilePictureAsync(Guid userId, IFormFile file);

    }
}
