namespace Application.Models.Common
{
    public class ErrorLogContext
    {
        public string? TraceId { get; set; }
        public string? RequestMethod { get; set; }
        public string? RequestPath { get; set; }
        public string? QueryString { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Source { get; set; }
    }
}
