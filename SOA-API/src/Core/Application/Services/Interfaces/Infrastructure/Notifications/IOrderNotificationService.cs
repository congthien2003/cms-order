using Application.Features.Orders.Models;

namespace Application.Services.Interfaces.Infrastructure.Notifications;

public interface IOrderNotificationService
{
    Task NotifyNewOrderAsync(OrderDetailResponse order);
}
