using Application.Services.Interfaces.Infrastructure.Cloud;
using Application.Services.Interfaces.Infrastructure.ImageOpimization;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Integrations.AzureBlob
{
    public class AzureBlobService : ICloudService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private readonly string? _blobUrl;
        private readonly IImageOptimizationService _imageOptimizationService;

        public AzureBlobService(IConfiguration configuration, IImageOptimizationService imageOptimizationService)
        {
            _imageOptimizationService = imageOptimizationService;
            
            // Try to get connection string first
            var connectionString = configuration.GetConnectionString("AzureBlobStorage");
            
            // If no connection string, try the existing Blob configuration
            if (string.IsNullOrEmpty(connectionString))
            {
                _blobUrl = configuration["Blob:URL"];
                if (string.IsNullOrEmpty(_blobUrl))
                {
                    throw new ArgumentNullException("Chuỗi kết nối AzureBlobStorage hoặc Blob:URL là bắt buộc");
                }
                
                // Extract connection string from the blob URL format
                var uri = new Uri(_blobUrl);
                var accountName = uri.Host.Split('.')[0];
                var sasToken = uri.Query;
                
                // Create connection string using account name and SAS token
                connectionString = $"BlobEndpoint=https://{accountName}.blob.core.windows.net/;SharedAccessSignature={sasToken.TrimStart('?')}";
            }
            
            _containerName = configuration["AzureBlob:ContainerName"] ?? "posts";
            
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        public async Task<string?> UploadAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var stream = file.OpenReadStream();
            return await UploadAsync(stream, file.FileName, file.ContentType);
        }

        public async Task<string?> UploadOptimizedAsync(IFormFile file, int maxWidth = 1920, int maxHeight = 1080, int quality = 75)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                // Optimize the image
                var optimizedStream = await _imageOptimizationService.OptimizeImageAsync(file, maxWidth, maxHeight, quality);
                
                // Determine the appropriate content type based on optimization
                var contentType = GetOptimizedContentType(file.FileName);
                var fileName = GetOptimizedFileName(file.FileName);
                
                return await UploadAsync(optimizedStream, fileName, contentType);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to upload optimized image: {ex.Message}", ex);
            }
        }

        public async Task<string?> UploadAsync(Stream stream, string fileName, string contentType)
        {
            try
            {
                // Get container client
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                
                // Create container if it doesn't exist
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                // Generate unique file name
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
                
                // Get blob client
                var blobClient = containerClient.GetBlobClient(uniqueFileName);

                // Set content type
                var blobHttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType
                };

                // Upload file
                await blobClient.UploadAsync(stream, new BlobUploadOptions
                {
                    HttpHeaders = blobHttpHeaders
                });

                // Return the URL
                return blobClient.Uri.ToString();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                throw new InvalidOperationException($"Failed to upload file to Azure Blob Storage: {ex.Message}", ex);
            }
            finally
            {
                if (stream.CanRead)
                {
                    stream.Dispose();
                }
            }
        }

        public async Task<bool> DeleteAsync(string fileUri, CancellationToken cancellationToken)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            // Parse từ Uri để lấy blob name
            var blobName = Path.GetFileName(fileUri);
            // ⚠️ chỉ đúng nếu blob nằm thẳng ở root. Nếu blob có folder kiểu "images/cat.png" thì dùng cách khác

            var blobClient = containerClient.GetBlobClient(blobName);

            return await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, null, cancellationToken);
        }


        private string GetOptimizedContentType(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            return extension switch
            {
                ".png" => "image/webp", // PNG converted to WebP
                ".webp" => "image/webp",
                _ => "image/jpeg" // Default to JPEG for other formats
            };
        }

        private string GetOptimizedFileName(string originalFileName)
        {
            var nameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            
            return extension switch
            {
                ".png" => $"{nameWithoutExtension}.webp",
                ".webp" => $"{nameWithoutExtension}.webp",
                _ => $"{nameWithoutExtension}.jpg"
            };
        }


    }
}
