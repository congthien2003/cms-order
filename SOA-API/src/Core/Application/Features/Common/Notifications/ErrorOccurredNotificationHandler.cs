using Application.Services.Interfaces;
using MediatR;

namespace Application.Features.Common.Notifications
{
    public class ErrorOccurredNotificationHandler : INotificationHandler<ErrorOccurredNotification>
    {
        private readonly IErrorLogService _errorLogService;

        public ErrorOccurredNotificationHandler(IErrorLogService errorLogService)
        {
            _errorLogService = errorLogService;
        }

        public async Task Handle(ErrorOccurredNotification notification, CancellationToken cancellationToken)
        {
            await _errorLogService.PersistAsync(
                notification.Exception,
                notification.Context,
                notification.StatusCode,
                notification.Level,
                cancellationToken);
        }
    }
}
