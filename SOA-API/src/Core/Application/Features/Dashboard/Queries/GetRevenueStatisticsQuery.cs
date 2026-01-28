using Application.Features.Dashboard.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Dashboard.Queries;

/// <summary>
/// Query to get revenue statistics for a date range
/// </summary>
public record GetRevenueStatisticsQuery(DateTime? FromDate, DateTime? ToDate) : IRequest<Result<RevenueStatisticsResponse>>;

public class GetRevenueStatisticsQueryHandler : IRequestHandler<GetRevenueStatisticsQuery, Result<RevenueStatisticsResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetRevenueStatisticsQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<RevenueStatisticsResponse>> Handle(GetRevenueStatisticsQuery request, CancellationToken cancellationToken)
    {
        // Default to last 7 days if no date range provided
        var toDate = request.ToDate?.Date.AddDays(1) ?? DateTime.UtcNow.Date.AddDays(1);
        var fromDate = request.FromDate?.Date ?? toDate.AddDays(-7);

        var orders = await _repositoryManager.OrderRepository
            .GetAllAsync(false, cancellationToken);

        var completedOrders = orders
            .Where(o => o.Status == OrderStatus.Completed && 
                        o.CreatedAt >= fromDate && 
                        o.CreatedAt < toDate)
            .ToList();

        var totalRevenue = completedOrders.Sum(o => o.TotalAmount);
        var totalOrders = completedOrders.Count;
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Group by day
        var dailyRevenue = completedOrders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new DailyRevenueItem
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.TotalAmount),
                OrderCount = g.Count()
            })
            .OrderBy(d => d.Date)
            .ToList();

        // Fill in missing days with zero values
        var allDays = new List<DailyRevenueItem>();
        for (var date = fromDate; date < toDate; date = date.AddDays(1))
        {
            var dayData = dailyRevenue.FirstOrDefault(d => d.Date == date);
            allDays.Add(dayData ?? new DailyRevenueItem
            {
                Date = date,
                Revenue = 0,
                OrderCount = 0
            });
        }

        var response = new RevenueStatisticsResponse
        {
            FromDate = fromDate,
            ToDate = toDate.AddDays(-1),
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            AverageOrderValue = Math.Round(averageOrderValue, 2),
            DailyRevenue = allDays
        };

        return Result<RevenueStatisticsResponse>.Success("Revenue statistics retrieved successfully", response);
    }
}
