using Application.Features.Orders.Models;
using Application.Services.Interfaces.Infrastructure.Notifications;
using Host.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Host.Services.Notifications;

public class OrderNotificationService : IOrderNotificationService
{
    private readonly IHubContext<OrderHub> _hubContext;

    public OrderNotificationService(IHubContext<OrderHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyNewOrderAsync(OrderDetailResponse order)
    {
        await _hubContext.Clients.Group("Admins").SendAsync("NewOrder", order);
    }
}
