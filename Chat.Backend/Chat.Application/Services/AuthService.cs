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

        public async Task<TokenResponse> LoginAsync(string username, string password, CancellationToken cancellationToken = default)
        {
            if(string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required", nameof(username));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Password is required", nameof(password));

            var user = await _userRepository.GetByUsernameAsync(username, cancellationToken);
            if(user == null)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }
            var verify = _passwordHasher.VerifyPassword(password, user.Password);

            if (!verify)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }
            var token = new TokenResponse { Token = _tokenService.GenerateToken(user.Id) };
            return token;

        }

        public async Task<TokenResponse> RegisterAsync(RegistrationDTO model, CancellationToken cancellationToken = default)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (string.IsNullOrWhiteSpace(model.Username)) throw new ArgumentException("Username is required", nameof(model.Username));
            if (string.IsNullOrWhiteSpace(model.Email)) throw new ArgumentException("Email is required", nameof(model.Email));
            if (string.IsNullOrWhiteSpace(model.Password)) throw new ArgumentException("Password is required", nameof(model.Password));
            if (model.Password.Length < 6) throw new ArgumentException("Password must be at least 6 characters long", nameof(model.Password));

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

