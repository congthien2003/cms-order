
namespace Host.Extensions
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class LoggerMiddlewareExtensions
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggerMiddlewareExtensions> _logger;

        public LoggerMiddlewareExtensions(RequestDelegate next, ILogger<LoggerMiddlewareExtensions> logger)
        {
            _next = next;
            _logger = logger;
        }

        public Task Invoke(HttpContext httpContext)
        {
            _logger.LogInformation($"{httpContext.Request.Method} {httpContext.Request.Path} from {httpContext.Connection.RemoteIpAddress}");
            return _next(httpContext);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class LoggerMiddlewareExtensionsExtensions
    {
        public static IApplicationBuilder UseLoggerMiddlewareExtensions(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LoggerMiddlewareExtensions>();
        }
    }
}
