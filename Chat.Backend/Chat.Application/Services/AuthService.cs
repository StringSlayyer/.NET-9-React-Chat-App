using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public AuthService(IPasswordHasher passwordHasher, IUserRepository userRepository, ITokenService tokenService)
        {
            _passwordHasher = passwordHasher;
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public Task<TokenResponse> LoginAsync(string username, string password, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<TokenResponse> RegisterAsync(RegistrationDTO model, CancellationToken cancellationToken = default)
        {
            User user = new User
            {
                Id = Guid.NewGuid(),
                Username = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Password = _passwordHasher.HashPassword(model.Password),
                CreatedAt = DateTime.UtcNow              

            };

            cancellationToken.ThrowIfCancellationRequested();

            await _userRepository.AddAsync(user, cancellationToken);

            var token = new TokenResponse { Token = _tokenService.GenerateToken(user.Id) };
            return token;
        }
    }
}

