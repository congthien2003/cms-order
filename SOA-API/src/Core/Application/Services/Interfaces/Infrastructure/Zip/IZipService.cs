namespace Application.Services.Interfaces.Infrastructure.Zip
{
    public interface IZipService
    {
        Task<byte[]> CreateZipFile(byte[] summaryExcel, string fileName, CancellationToken cancellationToken = default);
    }
}
