using Application.Services.Interfaces.Infrastructure.Zip;
using Microsoft.Extensions.Logging;
using System.IO.Compression;

namespace Infrastructures.Services.Zip
{
    public class ZipService : IZipService
    {
        private readonly ILogger<ZipService> _logger;

        public ZipService(ILogger<ZipService> logger)
        {
            _logger = logger;
        }
        public async Task<byte[]> CreateZipFile(byte[] summaryExcel, string fileName, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Create ZIP file with summary");

            using var zipStream = new MemoryStream();

            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
            {
                var summaryEntry = archive.CreateEntry(fileName);
                using (var summaryStream = summaryEntry.Open())
                {
                    await summaryStream.WriteAsync(summaryExcel, 0, summaryExcel.Length, cancellationToken);
                    _logger.LogInformation("Added summary file: {FileName}", fileName);
                }
            }

            var zipBytes = zipStream.ToArray();
            _logger.LogInformation("Successfully created ZIP file with {Size} bytes", zipBytes.Length);

            return zipBytes;
        }
    }
}
