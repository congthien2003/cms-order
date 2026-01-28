using Application.Features.Dashboard.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Dashboard.Queries;

/// <summary>
/// Query to get dashboard summary
/// </summary>
public record GetDashboardSummaryQuery : IRequest<Result<DashboardSummaryResponse>>;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, Result<DashboardSummaryResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetDashboardSummaryQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<DashboardSummaryResponse>> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var yesterday = today.AddDays(-1);

        // Today's orders
        var todayOrders = await _repositoryManager.OrderRepository
            .GetAllAsync(false, cancellationToken);
        
        var todayOrdersList = todayOrders
            .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow)
            .ToList();

        var yesterdayOrdersList = todayOrders
            .Where(o => o.CreatedAt >= yesterday && o.CreatedAt < today)
            .ToList();

        // Today's statistics
        var todayCompletedOrders = todayOrdersList.Where(o => o.Status == OrderStatus.Completed).ToList();
        var todayRevenue = todayCompletedOrders.Sum(o => o.TotalAmount);
        var todayCancelledOrders = todayOrdersList.Count(o => o.Status == OrderStatus.Cancelled);

        // Yesterday's statistics for comparison
        var yesterdayCompletedOrders = yesterdayOrdersList.Where(o => o.Status == OrderStatus.Completed).ToList();
        var yesterdayRevenue = yesterdayCompletedOrders.Sum(o => o.TotalAmount);

        // Calculate change percentages
        decimal revenueChangePercent = 0;
        if (yesterdayRevenue > 0)
        {
            revenueChangePercent = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        }
        else if (todayRevenue > 0)
        {
            revenueChangePercent = 100;
        }

        decimal orderCountChangePercent = 0;
        if (yesterdayOrdersList.Count > 0)
        {
            orderCountChangePercent = ((decimal)(todayOrdersList.Count - yesterdayOrdersList.Count) / yesterdayOrdersList.Count) * 100;
        }
        else if (todayOrdersList.Count > 0)
        {
            orderCountChangePercent = 100;
        }

        // Pending orders count (all time, not just today)
        var allOrders = todayOrders.ToList();
        var pendingOrders = allOrders.Count(o => o.Status == OrderStatus.Pending);
        var preparingOrders = allOrders.Count(o => o.Status == OrderStatus.Preparing);
        var readyOrders = allOrders.Count(o => o.Status == OrderStatus.Ready);

        var response = new DashboardSummaryResponse
        {
            TodayRevenue = todayRevenue,
            TodayOrderCount = todayOrdersList.Count,
            TodayCompletedOrders = todayCompletedOrders.Count,
            TodayCancelledOrders = todayCancelledOrders,
            PendingOrders = pendingOrders,
            PreparingOrders = preparingOrders,
            ReadyOrders = readyOrders,
            YesterdayRevenue = yesterdayRevenue,
            RevenueChangePercent = Math.Round(revenueChangePercent, 2),
            YesterdayOrderCount = yesterdayOrdersList.Count,
            OrderCountChangePercent = Math.Round(orderCountChangePercent, 2)
        };

        return Result<DashboardSummaryResponse>.Success("Dashboard summary retrieved successfully", response);
    }
}
