using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IFileStorageService _fileStorageService;
        public UserService(IUserRepository userRepository, IFileStorageService fileStorageService)
        {
            _userRepository = userRepository;
            _fileStorageService = fileStorageService;
        }
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetAllUsersAsync(cancellationToken);
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            });
        }

        public async Task<UserDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            if(id == Guid.Empty) return null;
            var user = await _userRepository.GetByIdAsync(id, cancellationToken);
            if (user == null) return null;
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<Result<ReturnFileDTO>> GetProfilePictureAsync(Guid guid)
        {
            var path = await _userRepository.GetByIdAsync(guid);
            var picture = await _fileStorageService.ReturnFile(path.ProfilePicturePath);
            return picture;
        }

        public async Task UploadProfilePictureAsync(Guid userId, IFormFile file)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new Exception("User not found");
            var path = await _fileStorageService.UploadFile(userId, file);
            
            if(path.IsSuccess)
            {
                user.ProfilePicturePath = path.Data;
                await _userRepository.UpdateUser(user);
            }
            else
            {
                throw new Exception(path.ErrorMessage);
            }

        }
    }
}
