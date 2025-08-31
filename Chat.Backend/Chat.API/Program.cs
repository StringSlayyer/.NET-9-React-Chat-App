
using Chat.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using DotNetEnv;


namespace Chat.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication();

            Env.Load();
            builder.Configuration.AddEnvironmentVariables();



            var app = builder.Build();

           
            app.MapOpenApi();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/openapi/v1.json", "v1");
            });


            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
