using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.DTOs
{
    public class ReturnFileDTO
    {
        public FileStream? FileStream { get; set; }
        public string? ContentType { get; set; }
        public string? FileUrl { get; set; }
    }
}
