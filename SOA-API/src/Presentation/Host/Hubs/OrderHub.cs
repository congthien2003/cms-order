using Microsoft.AspNetCore.SignalR;

namespace Host.Hubs;

public class OrderHub : Hub
{
    public async Task JoinAdminsGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
    }

    public async Task LeaveAdminsGroup()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
    }
}
