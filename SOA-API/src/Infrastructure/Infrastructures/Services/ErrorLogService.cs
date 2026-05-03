using Application.Exceptions;
using Application.Models.Common;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructures.Services
{
    public class ErrorLogService : IErrorLogService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<ErrorLogService> _logger;

        public ErrorLogService(ApplicationDbContext dbContext, ILogger<ErrorLogService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task PersistAsync(Exception exception, ErrorLogContext context, int statusCode, string level = "Error", CancellationToken cancellationToken = default)
        {
            try
            {
                var entity = new ErrorLog
                {
                    OccurredAtUtc = DateTime.UtcNow,
                    Level = level,
                    Message = exception.Message,
                    MessageKey = (exception as BaseException)?.MessageKey,
                    ExceptionType = exception.GetType().FullName,
                    StackTrace = exception.StackTrace,
                    StatusCode = statusCode,
                    TraceId = context.TraceId,
                    LoggingEvent = (exception as BaseException)?.LoggingEvents.ToString(),
                    MemberName = (exception as BaseException)?.MemberName,
                    LineNumber = (exception as BaseException)?.LineNumber,
                    RequestMethod = context.RequestMethod,
                    RequestPath = context.RequestPath,
                    QueryString = SanitizeQuery(context.QueryString),
                    UserId = context.UserId,
                    UserName = context.UserName,
                    Source = context.Source
                };

                await _dbContext.ErrorLogs.AddAsync(entity, cancellationToken);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to persist error log");
            }
        }

        public async Task<PagedResponse<ErrorLogSummaryResponse>> GetPagedAsync(ErrorLogQueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.ErrorLogs.AsNoTracking().AsQueryable();

            if (parameters.FromUtc.HasValue)
                query = query.Where(x => x.OccurredAtUtc >= parameters.FromUtc.Value);
            if (parameters.ToUtc.HasValue)
                query = query.Where(x => x.OccurredAtUtc <= parameters.ToUtc.Value);
            if (!string.IsNullOrWhiteSpace(parameters.Level))
                query = query.Where(x => x.Level == parameters.Level);
            if (parameters.StatusCode.HasValue)
                query = query.Where(x => x.StatusCode == parameters.StatusCode.Value);
            if (!string.IsNullOrWhiteSpace(parameters.Path))
                query = query.Where(x => x.RequestPath != null && x.RequestPath.Contains(parameters.Path));
            if (!string.IsNullOrWhiteSpace(parameters.UserId))
                query = query.Where(x => x.UserId == parameters.UserId);
            if (!string.IsNullOrWhiteSpace(parameters.TraceId))
                query = query.Where(x => x.TraceId == parameters.TraceId);

            var total = await query.CountAsync(cancellationToken);

            var page = parameters.Page < 1 ? 1 : parameters.Page;
            var pageSize = parameters.PageSize <= 0 ? 20 : Math.Min(parameters.PageSize, 100);

            var items = await query
                .OrderByDescending(x => x.OccurredAtUtc)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ErrorLogSummaryResponse
                {
                    Id = x.Id,
                    OccurredAtUtc = x.OccurredAtUtc,
                    Level = x.Level,
                    Message = x.Message,
                    StatusCode = x.StatusCode,
                    RequestPath = x.RequestPath,
                    RequestMethod = x.RequestMethod,
                    UserId = x.UserId,
                    UserName = x.UserName,
                    TraceId = x.TraceId
                })
                .ToListAsync(cancellationToken);

            return new PagedResponse<ErrorLogSummaryResponse>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        public async Task<ErrorLogDetailResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.ErrorLogs
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new ErrorLogDetailResponse
                {
                    Id = x.Id,
                    OccurredAtUtc = x.OccurredAtUtc,
                    Level = x.Level,
                    Message = x.Message,
                    StatusCode = x.StatusCode,
                    RequestPath = x.RequestPath,
                    RequestMethod = x.RequestMethod,
                    UserId = x.UserId,
                    UserName = x.UserName,
                    TraceId = x.TraceId,
                    MessageKey = x.MessageKey,
                    ExceptionType = x.ExceptionType,
                    StackTrace = x.StackTrace,
                    LoggingEvent = x.LoggingEvent,
                    MemberName = x.MemberName,
                    LineNumber = x.LineNumber,
                    QueryString = x.QueryString,
                    Source = x.Source,
                    Extra = x.Extra
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        private static string? SanitizeQuery(string? query)
        {
            if (string.IsNullOrWhiteSpace(query)) return query;

            var lowered = query.ToLowerInvariant();
            if (lowered.Contains("password") || lowered.Contains("token") || lowered.Contains("secret") || lowered.Contains("authorization"))
            {
                return "[REDACTED]";
            }

            return query.Length > 2000 ? query[..2000] : query;
        }
    }
}
