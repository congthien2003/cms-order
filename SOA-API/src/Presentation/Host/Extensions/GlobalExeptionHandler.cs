using Application.Exceptions;
using Application.Features.Common.Notifications;
using Application.Models.Common;
using Domain.ErrorModel;
using MediatR;
using Microsoft.AspNetCore.Diagnostics;
using System.Security.Claims;

namespace Host.Extensions
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        private readonly IPublisher _publisher;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IPublisher publisher)
        {
            _logger = logger;
            _publisher = publisher;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,
            Exception exception, CancellationToken cancellationToken)
        {
            httpContext.Response.ContentType = "application/json";

            var contextFeature = httpContext.Features.Get<IExceptionHandlerFeature>();
            if (contextFeature != null)
            {
                var (statusCode, message, messageKey, detail) = GetErrorDetails(contextFeature.Error);

                httpContext.Response.StatusCode = statusCode;

                _logger.LogError(exception,
                    "Unhandled exception at {Method} {Path}. TraceId: {TraceId}. StatusCode: {StatusCode}",
                    httpContext.Request.Method,
                    httpContext.Request.Path,
                    httpContext.TraceIdentifier,
                    statusCode);

                var logContext = new ErrorLogContext
                {
                    TraceId = httpContext.TraceIdentifier,
                    RequestMethod = httpContext.Request.Method,
                    RequestPath = httpContext.Request.Path.Value,
                    QueryString = httpContext.Request.QueryString.Value,
                    UserId = httpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                    UserName = httpContext.User?.FindFirst(ClaimTypes.Name)?.Value,
                    Source = nameof(GlobalExceptionHandler)
                };

                await _publisher.Publish(new ErrorOccurredNotification(exception, logContext, statusCode, "Error"), cancellationToken);

                await httpContext.Response.WriteAsync(new ErrorDetails()
                {
                    StatusCode = statusCode,
                    Message = message,
                    MessageKey = messageKey,
                    Detail = detail
                }.ToString());
            }

            return true;
        }

        private (int statusCode, string message, string? messageKey, string? detail) GetErrorDetails(Exception exception) => exception switch
        {
            // Custom exceptions
            NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                notFoundEx.Message,
                notFoundEx.MessageKey,
                $"Resource not found at {notFoundEx.MemberName}:{notFoundEx.LineNumber}"
            ),
            BadRequestException badRequestEx => (
                StatusCodes.Status400BadRequest,
                badRequestEx.Message,
                badRequestEx.MessageKey,
                $"Bad request at {badRequestEx.MemberName}:{badRequestEx.LineNumber}"
            ),
            UnauthorizedException unauthorizedEx => (
                StatusCodes.Status401Unauthorized,
                unauthorizedEx.Message,
                unauthorizedEx.MessageKey,
                $"Unauthorized access at {unauthorizedEx.MemberName}:{unauthorizedEx.LineNumber}"
            ),
            ForbiddenException forbiddenEx => (
                StatusCodes.Status403Forbidden,
                forbiddenEx.Message,
                forbiddenEx.MessageKey,
                $"Forbidden access at {forbiddenEx.MemberName}:{forbiddenEx.LineNumber}"
            ),
            ConflictException conflictEx => (
                StatusCodes.Status409Conflict,
                conflictEx.Message,
                conflictEx.MessageKey,
                $"Resource conflict at {conflictEx.MemberName}:{conflictEx.LineNumber}"
            ),
            ValidationException validationEx => (
                StatusCodes.Status422UnprocessableEntity,
                validationEx.Message,
                validationEx.MessageKey,
                $"Validation failed at {validationEx.MemberName}:{validationEx.LineNumber}"
            ),
            ModelStateValidationException modelStateEx => (
                StatusCodes.Status400BadRequest,
                modelStateEx.Message,
                modelStateEx.MessageKey,
                string.Join("; ", modelStateEx.ValidationErrors.SelectMany(e => e.Value.Select(v => $"{e.Key}: {v}")))
            ),

            // Standard exceptions that should be converted
            KeyNotFoundException keyNotFoundEx => (
                StatusCodes.Status404NotFound,
                "Không tìm thấy tài nguyên được yêu cầu",
                "RESOURCE-NOT-FOUND",
                keyNotFoundEx.Message
            ),
            ArgumentException argEx => (
                StatusCodes.Status400BadRequest,
                $"Trường không hợp lệ: {argEx.Message}",
                "INVALID-ARGUMENT",
                $"Tham số không hợp lệ: {argEx.Message}"
            ),
            InvalidOperationException invalidOpEx => (
                StatusCodes.Status400BadRequest,
                "Thao tác không hợp lệ cho trạng thái hiện tại",
                "INVALID-OPERATION",
                invalidOpEx.Message
            ),
            NotImplementedException notImplEx => (
                StatusCodes.Status501NotImplemented,
                "Tính năng này chưa được triển khai",
                "NOT-IMPLEMENTED",
                notImplEx.Message
            ),

            // Generic exception
            _ => (
                StatusCodes.Status500InternalServerError,
                "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
                "INTERNAL-SERVER-ERROR",
                $"Loại exception: {exception.GetType().Name}"
            )
        };
    }
}
