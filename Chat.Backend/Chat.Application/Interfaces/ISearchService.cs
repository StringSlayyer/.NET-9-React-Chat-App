using Chat.Application.DTOs;
using Chat.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Interfaces
{
    public interface ISearchService
    {
        Task<Result<SearchDTO>> SearchAsync(Guid userId, string query, CancellationToken cancellationToken = default);
    }
}
