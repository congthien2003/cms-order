using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Queries;

/// <summary>
/// Query to get paginated list of orders with filters
/// </summary>
public record GetOrdersListQuery(GetOrdersListParameters Parameters) : IRequest<Result<PagedList<OrderResponse>>>;

public class GetOrdersListQueryHandler : IRequestHandler<GetOrdersListQuery, Result<PagedList<OrderResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetOrdersListQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<PagedList<OrderResponse>>> Handle(GetOrdersListQuery request, CancellationToken cancellationToken)
    {
        var parameters = request.Parameters;
        
        var (orders, totalCount) = await _repositoryManager.OrderRepository
            .GetListAsync(
                parameters.PageNumber,
                parameters.PageSize,
                parameters.Search,
                parameters.Status,
                parameters.PaymentStatus,
                parameters.FromDate,
                parameters.ToDate,
                false,
                cancellationToken);

        var items = orders.Select(order => new OrderResponse
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
            })
            .ToList();

        var pagedList = new PagedList<OrderResponse>(items, totalCount, parameters.PageNumber, parameters.PageSize);
        return Result<PagedList<OrderResponse>>.Success("Orders retrieved successfully", pagedList);
    }
}
