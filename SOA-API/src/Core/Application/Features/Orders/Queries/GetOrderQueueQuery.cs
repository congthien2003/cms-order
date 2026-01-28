using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Queries;

/// <summary>
/// Query to get orders in queue (Pending, Confirmed, Preparing, Ready)
/// </summary>
public record GetOrderQueueQuery : IRequest<Result<IEnumerable<OrderResponse>>>;

public class GetOrderQueueQueryHandler : IRequestHandler<GetOrderQueueQuery, Result<IEnumerable<OrderResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetOrderQueueQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<IEnumerable<OrderResponse>>> Handle(GetOrderQueueQuery request, CancellationToken cancellationToken)
    {
        var orders = await _repositoryManager.OrderRepository
            .GetQueueOrdersAsync(false, cancellationToken);

        var response = orders
            .OrderBy(o => o.CreatedAt) // Oldest first for queue
            .Select(order => new OrderResponse
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                SubTotal = order.SubTotal,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                ItemCount = order.Items.Count,
                CreatedDate = order.CreatedAt
            });

        return Result<IEnumerable<OrderResponse>>.Success("Order queue retrieved successfully", response);
    }
}
