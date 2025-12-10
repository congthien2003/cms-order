using System.Text.Json;

namespace Domain.ErrorModel
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; }

        public string? Message { get; set; }
        
        public string? MessageKey { get; set; }
        
        public string? Detail { get; set; }
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public override string ToString() => JsonSerializer.Serialize(this, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }
}
