namespace Application.Models.Common
{
    public class ErrorLogQueryParameters
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public DateTime? FromUtc { get; set; }
        public DateTime? ToUtc { get; set; }
        public string? Level { get; set; }
        public int? StatusCode { get; set; }
        public string? Path { get; set; }
        public string? UserId { get; set; }
        public string? TraceId { get; set; }
    }
}
