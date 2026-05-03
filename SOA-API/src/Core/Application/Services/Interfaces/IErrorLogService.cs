using Application.Models.Common;

namespace Application.Services.Interfaces
{
    public interface IErrorLogService
    {
        Task PersistAsync(Exception exception, ErrorLogContext context, int statusCode, string level = "Error", CancellationToken cancellationToken = default);
        Task<PagedResponse<ErrorLogSummaryResponse>> GetPagedAsync(ErrorLogQueryParameters parameters, CancellationToken cancellationToken = default);
        Task<ErrorLogDetailResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
