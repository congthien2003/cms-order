using Application.Features.Orders.Models;

namespace Application.Services.Interfaces.Infrastructure.Notifications;

public interface IOrderNotificationService
{
    Task NotifyNewOrderAsync(OrderDetailResponse order);
}

public class NullOrderNotificationService : IOrderNotificationService
{
    public Task NotifyNewOrderAsync(OrderDetailResponse order)
    {
        return Task.CompletedTask;
    }
}
