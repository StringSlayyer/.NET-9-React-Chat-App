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
    public interface IFileStorageService
    {
        Task<Result<string>> UploadFile(Guid userId, IFormFile file);
        Task<string> SaveFileAsync(int userId, string fileName, Stream fileStream);
            Task<Result<ReturnFileDTO>> ReturnFile(string filePath);
        public void DeleteFile(string filePath);
    }
}
