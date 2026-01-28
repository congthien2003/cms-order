using Application.Features.Dashboard.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Dashboard.Queries;

/// <summary>
/// Query to get top selling products
/// </summary>
public record GetTopProductsQuery(DateTime? FromDate, DateTime? ToDate, int Top = 10) : IRequest<Result<TopProductsResponse>>;

public class GetTopProductsQueryHandler : IRequestHandler<GetTopProductsQuery, Result<TopProductsResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetTopProductsQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<TopProductsResponse>> Handle(GetTopProductsQuery request, CancellationToken cancellationToken)
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

        // Get all products for category names
        var products = await _repositoryManager.ProductRepository
            .GetAllAsync(false, cancellationToken);

        var categories = await _repositoryManager.CategoryRepository
            .GetAllAsync(false, cancellationToken);

        var productDict = products.ToDictionary(p => p.Id, p => p);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        // Aggregate by product
        var productSales = completedOrders
            .SelectMany(o => o.Items)
            .GroupBy(i => i.ProductId)
            .Select(g => 
            {
                var product = productDict.GetValueOrDefault(g.Key);
                var categoryName = product != null && categoryDict.ContainsKey(product.CategoryId) 
                    ? categoryDict[product.CategoryId] 
                    : null;

                return new TopProductItem
                {
                    ProductId = g.Key,
                    ProductName = g.First().ProductName,
                    CategoryName = categoryName,
                    QuantitySold = g.Sum(i => i.Quantity),
                    Revenue = g.Sum(i => i.ItemTotal)
                };
            })
            .OrderByDescending(p => p.QuantitySold)
            .Take(request.Top)
            .ToList();

        var response = new TopProductsResponse
        {
            FromDate = fromDate,
            ToDate = toDate.AddDays(-1),
            Products = productSales
        };

        return Result<TopProductsResponse>.Success("Top products retrieved successfully", response);
    }
}
