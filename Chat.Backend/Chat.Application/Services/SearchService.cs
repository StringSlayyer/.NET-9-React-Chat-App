using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class SearchService : ISearchService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConversationRepository _conversationRepository;
        public SearchService(IUserRepository userRepository, IConversationRepository conversationRepository)
        {
            _userRepository = userRepository;
            _conversationRepository = conversationRepository;
        }
        public async Task<Result<SearchDTO>> SearchAsync(Guid userId, string query, CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.SearchUsersAsync(query, cancellationToken);
            var conversations = await _conversationRepository.SearchConversationsAsync(userId, query, cancellationToken);
            var result = new SearchDTO
            {
                Users = users.Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                }).ToList(),
                Conversations = conversations.Select(c => new ConversationDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Participants = c.Participants.Select(p => new ConversationParticipantDTO
                    {
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        Id = p.User.Id
                    }).ToList()
                }).ToList()
            };

            return Result<SearchDTO>.Success(result);
        }
    }
}
