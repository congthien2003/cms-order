using Microsoft.AspNetCore.Http;

namespace Application.Services.Interfaces.Infrastructure.Cloud
{
    public interface ICloudService
    {
        Task<string?> UploadAsync(IFormFile file);
        Task<string?> UploadOptimizedAsync(IFormFile file, int maxWidth = 1920, int maxHeight = 1080, int quality = 75);
        Task<string?> UploadAsync(Stream stream, string fileName, string contentType);
        Task<bool> DeleteAsync(string fileUri, CancellationToken cancellationToken);
    }
}
