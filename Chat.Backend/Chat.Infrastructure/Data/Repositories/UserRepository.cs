using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Infrastructure.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(User user, CancellationToken cancellationToken = default)
        {
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Users.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
            return user;
        }

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            return user;
        }

        public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
            return user;
        }

        public async Task<IEnumerable<User>> SearchUsersAsync(string query, CancellationToken cancellationToken = default)
        {
            query = query.ToLower();
            return await _context.Users.AsNoTracking().Where(u => u.FirstName.ToLower().StartsWith(query) || u.LastName.ToLower().StartsWith(query) || u.Username.ToLower().StartsWith(query))
                .Take(10).ToListAsync(cancellationToken);
        }

        public Task UpdateUser(User user, CancellationToken cancellationToken = default)
        {
            _context.Users.Update(user);
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
