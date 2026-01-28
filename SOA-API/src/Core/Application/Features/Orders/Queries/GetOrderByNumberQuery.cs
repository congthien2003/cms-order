using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Queries;

/// <summary>
/// Query to get order by order number
/// </summary>
public record GetOrderByNumberQuery(string OrderNumber) : IRequest<Result<OrderDetailResponse>>;

public class GetOrderByNumberQueryHandler : IRequestHandler<GetOrderByNumberQuery, Result<OrderDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetOrderByNumberQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrderDetailResponse>> Handle(GetOrderByNumberQuery request, CancellationToken cancellationToken)
    {
        var order = await _repositoryManager.OrderRepository
            .GetByOrderNumberAsync(request.OrderNumber, false, cancellationToken);

        if (order == null)
            throw new NotFoundException($"Order with number {request.OrderNumber} not found", "ORDER.NOTFOUND");

        var response = new OrderDetailResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            SubTotal = order.SubTotal,
            DiscountAmount = order.DiscountAmount,
            VATPercentage = order.VATPercentage,
            VATAmount = order.VATAmount,
            IsVATIncluded = order.IsVATIncluded,
            TotalAmount = order.TotalAmount,
            VoucherId = order.VoucherId,
            VoucherCode = order.VoucherCode,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = order.PaymentStatus,
            Note = order.Note,
            ItemCount = order.Items.Count,
            CreatedDate = order.CreatedAt,
            ModifiedDate = order.UpdatedAt,
            Items = order.Items.Select(item => new OrderItemResponse
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                ProductSizeId = item.ProductSizeId,
                SizeName = item.SizeName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                ToppingTotal = item.ToppingTotal,
                ItemTotal = item.ItemTotal,
                Note = item.Note,
                Toppings = item.Toppings.Select(t => new OrderItemToppingResponse
                {
                    Id = t.Id,
                    ToppingId = t.ToppingId,
                    ToppingName = t.ToppingName,
                    Price = t.Price,
                    Quantity = t.Quantity
                }).ToList()
            }).ToList()
        };

        return Result<OrderDetailResponse>.Success("Order retrieved successfully", response);
    }
}
