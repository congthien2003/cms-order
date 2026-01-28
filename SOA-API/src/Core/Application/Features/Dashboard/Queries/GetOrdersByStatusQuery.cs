using Application.Features.Dashboard.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Dashboard.Queries;

/// <summary>
/// Query to get orders count by status
/// </summary>
public record GetOrdersByStatusQuery(DateTime? FromDate, DateTime? ToDate) : IRequest<Result<OrdersByStatusResponse>>;

public class GetOrdersByStatusQueryHandler : IRequestHandler<GetOrdersByStatusQuery, Result<OrdersByStatusResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetOrdersByStatusQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrdersByStatusResponse>> Handle(GetOrdersByStatusQuery request, CancellationToken cancellationToken)
    {
        var orders = await _repositoryManager.OrderRepository
            .GetAllAsync(false, cancellationToken);

        var filteredOrders = orders.AsEnumerable();

        if (request.FromDate.HasValue)
        {
            var fromDate = request.FromDate.Value.Date;
            filteredOrders = filteredOrders.Where(o => o.CreatedAt >= fromDate);
        }

        if (request.ToDate.HasValue)
        {
            var toDate = request.ToDate.Value.Date.AddDays(1);
            filteredOrders = filteredOrders.Where(o => o.CreatedAt < toDate);
        }

        var ordersList = filteredOrders.ToList();

        var response = new OrdersByStatusResponse
        {
            Pending = ordersList.Count(o => o.Status == OrderStatus.Pending),
            Confirmed = ordersList.Count(o => o.Status == OrderStatus.Confirmed),
            Preparing = ordersList.Count(o => o.Status == OrderStatus.Preparing),
            Ready = ordersList.Count(o => o.Status == OrderStatus.Ready),
            Completed = ordersList.Count(o => o.Status == OrderStatus.Completed),
            Cancelled = ordersList.Count(o => o.Status == OrderStatus.Cancelled),
            Total = ordersList.Count
        };

        return Result<OrdersByStatusResponse>.Success("Orders by status retrieved successfully", response);
    }
}
