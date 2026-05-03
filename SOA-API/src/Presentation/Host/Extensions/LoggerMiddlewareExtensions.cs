using System.Diagnostics;

namespace Host.Extensions
{
    public class LoggerMiddlewareExtensions
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggerMiddlewareExtensions> _logger;

        public LoggerMiddlewareExtensions(RequestDelegate next, ILogger<LoggerMiddlewareExtensions> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var stopwatch = Stopwatch.StartNew();
            var traceId = httpContext.TraceIdentifier;
            var method = httpContext.Request.Method;
            var path = httpContext.Request.Path.Value;

            try
            {
                await _next(httpContext);
            }
            finally
            {
                stopwatch.Stop();
                _logger.LogInformation(
                    "HTTP {Method} {Path} responded {StatusCode} in {DurationMs}ms. TraceId: {TraceId}",
                    method,
                    path,
                    httpContext.Response.StatusCode,
                    stopwatch.ElapsedMilliseconds,
                    traceId);
            }
        }
    }

    public static class LoggerMiddlewareExtensionsExtensions
    {
        public static IApplicationBuilder UseLoggerMiddlewareExtensions(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LoggerMiddlewareExtensions>();
        }
    }
}
