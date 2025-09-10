﻿namespace Chat.Application.DTOs
{
    public class MessageDto
    {
        public Guid? Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime? Timestamp { get; set; }
    }
}