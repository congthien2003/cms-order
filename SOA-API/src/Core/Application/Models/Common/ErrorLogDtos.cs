namespace Application.Models.Common
{
    public class ErrorLogSummaryResponse
    {
        public Guid Id { get; set; }
        public DateTime OccurredAtUtc { get; set; }
        public string Level { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int? StatusCode { get; set; }
        public string? RequestPath { get; set; }
        public string? RequestMethod { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? TraceId { get; set; }
    }

    public class ErrorLogDetailResponse : ErrorLogSummaryResponse
    {
        public string? MessageKey { get; set; }
        public string? ExceptionType { get; set; }
        public string? StackTrace { get; set; }
        public string? LoggingEvent { get; set; }
        public string? MemberName { get; set; }
        public int? LineNumber { get; set; }
        public string? QueryString { get; set; }
        public string? Source { get; set; }
        public string? Extra { get; set; }
    }
}
