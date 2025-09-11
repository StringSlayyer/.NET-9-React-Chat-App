using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace Chat.API.Services
{
    public class OpenApiServerTransformer : IOpenApiDocumentTransformer
    {
        public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            document.Servers.Clear();

            document.Servers.Add(new OpenApiServer
            {
                Url = "http://localhost:8080"
            });
            return Task.CompletedTask;
        }
    }
}
