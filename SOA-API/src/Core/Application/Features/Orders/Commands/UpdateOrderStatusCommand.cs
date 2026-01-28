using Application.Exceptions;
using Application.Features.Orders.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Orders.Commands;

/// <summary>
/// Command to update order status
/// </summary>
public record UpdateOrderStatusCommand(Guid Id, UpdateOrderStatusRequest Request) : IRequest<Result<OrderDetailResponse>>;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Result<OrderDetailResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdateOrderStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<OrderDetailResponse>> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _repositoryManager.OrderRepository
            .GetWithDetailsAsync(request.Id, true, cancellationToken);

        if (order == null)
            throw new NotFoundException($"Order with ID {request.Id} not found", "ORDER.NOTFOUND");

        // Apply status change based on new status
        switch (request.Request.Status)
        {
            case OrderStatus.Confirmed:
                order.Confirm();
                break;
            case OrderStatus.Preparing:
                order.StartPreparing();
                break;
            case OrderStatus.Ready:
                order.MarkAsReady();
                break;
            case OrderStatus.Completed:
                order.Complete();
                break;
            case OrderStatus.Cancelled:
                order.Cancel(request.Request.Reason);
                break;
            default:
                order.UpdateStatus(request.Request.Status);
                break;
        }

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = MapToDetailResponse(order);
        var statusText = request.Request.Status.ToString().ToLower();
        return Result<OrderDetailResponse>.Success($"Order {statusText} successfully", response);
    }

    private static OrderDetailResponse MapToDetailResponse(Domain.Entities.Order order)
    {
        return new OrderDetailResponse
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
    }
}
