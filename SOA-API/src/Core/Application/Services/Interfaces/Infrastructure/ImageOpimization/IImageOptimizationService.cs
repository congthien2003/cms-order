using Microsoft.AspNetCore.Http;

namespace Application.Services.Interfaces.Infrastructure.ImageOpimization
{
    public interface IImageOptimizationService
    {
        Task<Stream> OptimizeImageAsync(IFormFile file, int maxWidth = 1920, int maxHeight = 1080, int quality = 75);
        Task<Stream> OptimizeImageAsync(Stream imageStream, string fileName, int maxWidth = 1920, int maxHeight = 1080, int quality = 75);
    }
}
