using Application.Models.Common;
using MediatR;

namespace Application.Features.Common.Notifications
{
    public record ErrorOccurredNotification(
        Exception Exception,
        ErrorLogContext Context,
        int StatusCode,
        string Level = "Error") : INotification;
}
