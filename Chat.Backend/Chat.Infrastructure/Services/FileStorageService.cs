using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _fileStoragePath;
        private readonly ILogger<FileStorageService> _logger;
        private readonly List<string> _allowedExtensions = [".jpg", ".jpeg", ".png", ".heic", ".heif", ".mp4", ".hevc"];
        public FileStorageService(IConfiguration configuration, ILogger<FileStorageService> logger)
        {
            _fileStoragePath = configuration["FILE_STORAGE_PATH"];
            _logger = logger;
        }
        public async Task<Result<string>> UploadFile(Guid id, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return Result<string>.Failure("No file provided or file is empty");
                }

                var extension = Path.GetExtension(file.FileName);
                _logger.LogInformation("dany extension {ext}", extension);
                if (!_allowedExtensions.Contains(extension))
                {
                    return Result<string>.Failure("File type not allowed");
                }

                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var savedFilePath = await SaveFileAsync(id, fileName, file.OpenReadStream());


                return Result<string>.Success(savedFilePath);
            }
            catch (Exception ex)
            {
                return Result<string>.Failure($"Exception: {ex.Message}");
            }
        }
        public async Task<string> SaveFileAsync(Guid userId, string fileName, Stream fileStream)
        {
            _fileStoragePath.Trim();
            Directory.CreateDirectory(_fileStoragePath);
            var userDirectory = Path.Combine(_fileStoragePath, $"user_{userId}");
            Directory.CreateDirectory(userDirectory);

            var filePath = Path.Combine(userDirectory, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await fileStream.CopyToAsync(stream);

            var response = Path.Combine($"user_{userId}", fileName);

            return response;
        }

        public void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public async Task<Result<ReturnFileDTO>> ReturnFile(string filePath)
        {
            var model = new ReturnFileDTO();
            var fullPath = Path.Combine(_fileStoragePath, filePath);

            if (!Directory.Exists(_fileStoragePath))
            {
                return Result<ReturnFileDTO>.Failure("Folder does not exist");
            }
            try
            {
                if (!File.Exists(fullPath))
                {
                    return Result<ReturnFileDTO>.Failure("File does not exist");
                }


                model.FileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                model.ContentType = GetContentType(fullPath);

                return Result<ReturnFileDTO>.Success(model);
            }
            catch (Exception ex)
            {
                return Result<ReturnFileDTO>.Failure($"Exception {ex}");
            }


        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(path, out var contentType))
            {
                contentType = "application/octet-stream"; // Default content type for unknown types
            }
            return contentType;
        }


    }
}
