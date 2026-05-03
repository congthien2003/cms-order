using Domain.Abstractions;

namespace Domain.Entities
{
    public class ErrorLog : BaseEntity
    {
        public DateTime OccurredAtUtc { get; set; } = DateTime.UtcNow;
        public string Level { get; set; } = "Error";
        public string Message { get; set; } = string.Empty;
        public string? MessageKey { get; set; }
        public string? ExceptionType { get; set; }
        public string? StackTrace { get; set; }
        public int? StatusCode { get; set; }
        public string? TraceId { get; set; }
        public string? LoggingEvent { get; set; }
        public string? MemberName { get; set; }
        public int? LineNumber { get; set; }
        public string? RequestMethod { get; set; }
        public string? RequestPath { get; set; }
        public string? QueryString { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Source { get; set; }
        public string? Extra { get; set; }
    }
}
