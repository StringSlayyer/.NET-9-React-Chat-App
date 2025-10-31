using Chat.Application.DTOs;
using Chat.Application.Models;
using Chat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task AddAsync(User user, CancellationToken cancellationToken = default);
        Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken cancellationToken = default);
        Task<Result> UpdateUser(User user, CancellationToken cancellationToken = default);
        Task<IEnumerable<User>> SearchUsersAsync(string query, CancellationToken cancellationToken = default);
        Task<Result> UpdatePasswordAsync(Guid userId, string newPassword, CancellationToken cancellationToken = default);
    }
}
