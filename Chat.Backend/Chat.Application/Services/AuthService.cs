using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
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
        private readonly IFileStorageService _fileStorageService;
        public AuthService(IPasswordHasher passwordHasher, IUserRepository userRepository, ITokenService tokenService, IFileStorageService fileStorageService)
        {
            _passwordHasher = passwordHasher;
            _userRepository = userRepository;
            _tokenService = tokenService;
            _fileStorageService = fileStorageService;
        }

        public async Task<Result<TokenResponse>> LoginAsync(string username, string password, CancellationToken cancellationToken = default)
        {
            if(string.IsNullOrWhiteSpace(username)) return new Result<TokenResponse> { ErrorMessage = "Username is required", IsSuccess = false };
            if (string.IsNullOrWhiteSpace(password)) return new Result<TokenResponse> { ErrorMessage = "Password is required", IsSuccess = false };

            var user = await _userRepository.GetByUsernameAsync(username, cancellationToken);
            if(user == null) return new Result<TokenResponse> { ErrorMessage = "Invalid username or password", IsSuccess = false };
            var verify = _passwordHasher.VerifyPassword(password, user.Password);

            if (!verify) return new Result<TokenResponse> { ErrorMessage = "Invalid username or password", IsSuccess = false };

            var token = new TokenResponse { Token = _tokenService.GenerateToken(user.Id) };
            return new Result<TokenResponse> { Data = token, IsSuccess = true };

        }

        public async Task<Result<TokenResponse>> RegisterAsync(RegistrationDTO model, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(model.Username)) return new Result<TokenResponse> { ErrorMessage = "Password must be at least 6 characters long", IsSuccess = false};
            if (string.IsNullOrWhiteSpace(model.Email)) return new Result<TokenResponse> { ErrorMessage = "Email is required", IsSuccess = false };
            if (string.IsNullOrWhiteSpace(model.Password)) return new Result<TokenResponse> { ErrorMessage = "Password is required", IsSuccess = false };
            if (model.Password.Length < 6) return new Result<TokenResponse> { ErrorMessage = "Password must be at least 6 characters long", IsSuccess = false };

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

            if(model.ProfilePicture != null && model.ProfilePicture.Length > 0)
            {
                var profilePicturePath = await _fileStorageService.UploadFile(user.Id, model.ProfilePicture);
                user.ProfilePicturePath = profilePicturePath.IsSuccess ? profilePicturePath.Data : null;
            }

            await _userRepository.AddAsync(user, cancellationToken);

            var token = new TokenResponse { Token = _tokenService.GenerateToken(user.Id) };
            return new Result<TokenResponse> { Data = token, IsSuccess = true };
        }
    }
}

