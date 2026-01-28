using Application.Features.Dashboard.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Dashboard.Queries;

/// <summary>
/// Query to get revenue by category
/// </summary>
public record GetRevenueByCategoryQuery(DateTime? FromDate, DateTime? ToDate) : IRequest<Result<RevenueByCategoryResponse>>;

public class GetRevenueByCategoryQueryHandler : IRequestHandler<GetRevenueByCategoryQuery, Result<RevenueByCategoryResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetRevenueByCategoryQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<RevenueByCategoryResponse>> Handle(GetRevenueByCategoryQuery request, CancellationToken cancellationToken)
    {
        // Default to last 30 days if no date range provided
        var toDate = request.ToDate?.Date.AddDays(1) ?? DateTime.UtcNow.Date.AddDays(1);
        var fromDate = request.FromDate?.Date ?? toDate.AddDays(-30);

        var orders = await _repositoryManager.OrderRepository
            .GetAllAsync(false, cancellationToken);

        var completedOrders = orders
            .Where(o => o.Status == OrderStatus.Completed && 
                        o.CreatedAt >= fromDate && 
                        o.CreatedAt < toDate)
            .ToList();

        // Get products and categories
        var products = await _repositoryManager.ProductRepository
            .GetAllAsync(false, cancellationToken);

        var categories = await _repositoryManager.CategoryRepository
            .GetAllAsync(false, cancellationToken);

        var productCategoryMap = products.ToDictionary(p => p.Id, p => p.CategoryId);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        // Aggregate revenue by category
        var totalRevenue = completedOrders.Sum(o => o.TotalAmount);

        var categoryRevenue = completedOrders
            .SelectMany(o => o.Items.Select(i => new { OrderId = o.Id, Item = i }))
            .GroupBy(x => 
            {
                if (productCategoryMap.TryGetValue(x.Item.ProductId, out var categoryId))
                    return categoryId;
                return Guid.Empty;
            })
            .Where(g => g.Key != Guid.Empty)
            .Select(g =>
            {
                var revenue = g.Sum(x => x.Item.ItemTotal);
                var orderIds = g.Select(x => x.OrderId).Distinct().Count();
                
                return new CategoryRevenueItem
                {
                    CategoryId = g.Key,
                    CategoryName = categoryDict.GetValueOrDefault(g.Key, "Unknown"),
                    Revenue = revenue,
                    Percentage = totalRevenue > 0 ? Math.Round((revenue / totalRevenue) * 100, 2) : 0,
                    OrderCount = orderIds
                };
            })
            .OrderByDescending(c => c.Revenue)
            .ToList();

        var response = new RevenueByCategoryResponse
        {
            FromDate = fromDate,
            ToDate = toDate.AddDays(-1),
            TotalRevenue = totalRevenue,
            Categories = categoryRevenue
        };

        return Result<RevenueByCategoryResponse>.Success("Revenue by category retrieved successfully", response);
    }
}
