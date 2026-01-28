using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Queries;

/// <summary>
/// Query to get today's orders
/// </summary>
public record GetTodayOrdersQuery : IRequest<Result<IEnumerable<OrderResponse>>>;

public class GetTodayOrdersQueryHandler : IRequestHandler<GetTodayOrdersQuery, Result<IEnumerable<OrderResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetTodayOrdersQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<IEnumerable<OrderResponse>>> Handle(GetTodayOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _repositoryManager.OrderRepository
            .GetTodayOrdersAsync(false, cancellationToken);

        var response = orders
            .OrderByDescending(o => o.CreatedAt) // Newest first
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

        return Result<IEnumerable<OrderResponse>>.Success("Today's orders retrieved successfully", response);
    }
}
