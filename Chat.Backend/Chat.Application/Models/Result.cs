using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Models
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public T? Data { get; set; }

        public static Result<T> Success(T value) => 
            new Result<T> { IsSuccess = true, Data = value };
        public static Result<T> Failure(string errorMessage) =>
            new Result<T> { IsSuccess = false, ErrorMessage = errorMessage };
    }
}
